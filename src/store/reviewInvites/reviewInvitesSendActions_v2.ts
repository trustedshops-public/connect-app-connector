import {
  getEtrustedIEventType,
  getEtrustedInviteSettings,
  patchInviteSettings,
  patchInviteSettingsById,
  postEtrustedIEventType,
} from '@/api/api'
import { GetState, SetState } from 'zustand'
import { AppStore } from '../useStore'
import { CHECKOUT_TYPE } from './reviewInvitesSendActions'
import {
  AvilableOrderStatusesType,
  EventType,
  InviteSettingsByChannelType,
  PayloadUsedOrders,
  ReviewInvitesActionsStore_2,
} from './types'
import { EVENTS, dispatchAction } from '@/eventsLib'

const defaultStatus = {
  name: CHECKOUT_TYPE,
  ID: CHECKOUT_TYPE, // You might want to use a unique ID here, like a string
  event_type: CHECKOUT_TYPE,
}

export const reviewInvitesActionsStore_v2 = (
  set: SetState<AppStore>,
  get: GetState<AppStore>
): ReviewInvitesActionsStore_2 => ({
  setAvailableOrderStatuses: (value: AvilableOrderStatusesType[]) => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        availableOrderStatusesAction: [defaultStatus, ...value],
      },
    }))
  },
  setUsedOrderStatuses: (value: PayloadUsedOrders) => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        selectedReviews: value.activeStatus,
        initialSelectedReviews: value.activeStatus,
      },
    }))
  },
  getEventTypesFromApi_v2: async (): Promise<void> => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        isLoading: true,
      },
    }))
    try {
      const token = get().auth.user?.access_token
      const selectedShopChannel = get().channelState.selectedShopChannels
      const infoOfSystem = get().infoState.infoOfSystem

      const inviteSettingsByChannel = await getEtrustedInviteSettings(
        selectedShopChannel,
        infoOfSystem,
        token as string
      )
      const eventTypes = await getEtrustedIEventType(
        selectedShopChannel,
        infoOfSystem,
        token as string
      )

      set(store => ({
        reviewInvitesState: {
          ...store.reviewInvitesState,
          eventTypes,
          inviteSettingsByChannel,
          isLoading: false,
        },
      }))
    } catch (error) {
      console.log(error)
    }
  },

  setSelectedReviews: value => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        selectedReviews: { ...store.reviewInvitesState.selectedReviews, ...value },
      },
    }))
  },
  saveChangeUseTimeOfSendReviewInvites_v2: async () => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        isLoading: true,
        // eventTypesAreLoadedFromAPI: true,
      },
    }))
    const selectedReviews = get().reviewInvitesState.selectedReviews
    const token = get().auth.user?.access_token
    const eTrustedChannelRef = get().channelState.selectedShopChannels.eTrustedChannelRef
    const salesChannelRef = get().channelState.selectedShopChannels.salesChannelRef
    const selectedShopChannel = get().channelState.selectedShopChannels
    const info = get().infoState.infoOfSystem
    const eventTypes = get().reviewInvitesState.eventTypes
    const inviteSettingsByChannel = get().reviewInvitesState.inviteSettingsByChannel

    const promiseAllRequest = (f: any) => {
      set(store => ({
        reviewInvitesState: {
          ...store.reviewInvitesState,
          // eventTypesAreLoadedFromAPI: true,
          isLoading: true,
        },
      }))
      Promise.all(f).then(() => get().getEventTypesFromApi_v2())
    }

    const parseExpression = (name: string) =>
      `${name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase()}_from_${info.nameOfSystem}`

    const callPromise = async (
      inviteSettings: InviteSettingsByChannelType[],
      eventTypeId: string
    ): Promise<void> => {
      const promises = inviteSettings.map(async invite => {
        const checkoutEventType = eventTypes.find(item => item.name === CHECKOUT_TYPE)
        const isEventsByOrderStatusNotCheckout = invite.eventTypeId === eventTypeId
        const isCheckoutType = invite.eventTypeId === checkoutEventType?.id

        const isEnableProduct =
          (selectedReviews.product?.ID === defaultStatus.ID
            ? isCheckoutType
            : isEventsByOrderStatusNotCheckout) && info.allowsSendReviewInvitesForProduct
        const isEnableService =
          selectedReviews.service?.ID === defaultStatus.ID
            ? isCheckoutType
            : isEventsByOrderStatusNotCheckout

        await patchInviteSettingsById(
          selectedShopChannel,
          info,
          token as string,
          invite.id as string,
          {
            enabled: isEnableProduct || isEnableService,
            serviceInviteConfiguration: {
              enabled: isEnableService,
            },
            productInviteConfiguration: {
              enabled: isEnableProduct,
            },
          }
        )
      }) as Promise<void>[]

      await Promise.all(promises)
    }

    let delay = 1000

    const handlePatchInviteSetting = async (eventType: EventType) => {
      const body = {
        serviceInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
        productInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
        enabled: false,
      }
      await patchInviteSettings(selectedShopChannel, info, token as string, eventType.id, body)
        .then(async () => {
          await getEtrustedInviteSettings(selectedShopChannel, info, token as string).then(
            async responce => await callPromise(responce, eventType.id)
          )
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          if (delay >= 8000) return console.error(err)

          setTimeout(() => {
            handlePatchInviteSetting(eventType)
          }, delay)
          delay = 2 * delay
        })
    }

    const handeleRequestsForSelectedReview = async (name: string) => {
      const parsedName = defaultStatus.name === name ? name : parseExpression(name)
      const eventType = eventTypes.find(item => item.name === parsedName)

      if (!eventType) {
        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: parsedName,
        }).then(async eventType => {
          await handlePatchInviteSetting(eventType)
        })
      } else {
        await callPromise(inviteSettingsByChannel, eventType.id)
      }
    }

    //case1: Service Reviews=Checkout AND Product Reviews=Checkout
    if (
      info.allowsSendReviewInvitesForProduct &&
      selectedReviews.service?.ID === defaultStatus.ID &&
      selectedReviews.product?.ID === defaultStatus.ID
    ) {
      const checkoutEventType = eventTypes.find(item => item.name === CHECKOUT_TYPE)

      promiseAllRequest(
        inviteSettingsByChannel.map(async invite => {
          const isCheckoutType = invite.eventTypeId === checkoutEventType?.id
          if (!info.allowsEventsByOrderStatus && !isCheckoutType) return

          await patchInviteSettingsById(
            selectedShopChannel,
            info,
            token as string,
            invite.id as string,
            {
              enabled: isCheckoutType,
              serviceInviteConfiguration: {
                enabled: isCheckoutType,
              },
              productInviteConfiguration: {
                enabled: isCheckoutType,
              },
            }
          )
        })
      )
    }

    //case2: Service Reviews=ELSE AND Product Reviews=Checkout
    if (
      info.allowsSendReviewInvitesForProduct &&
      selectedReviews.service?.ID !== defaultStatus.ID &&
      selectedReviews.product?.ID === defaultStatus.ID
    ) {
      handeleRequestsForSelectedReview(selectedReviews.service?.name || '')
    }

    //case3: Service Reviews=Checkout AND Product Reviews=ELSE
    if (
      info.allowsSendReviewInvitesForProduct &&
      selectedReviews.service?.ID === defaultStatus.ID &&
      selectedReviews.product?.ID !== defaultStatus.ID
    ) {
      handeleRequestsForSelectedReview(selectedReviews.product?.name || '')
    }

    //case4: Service Reviews=ELSE AND Product Reviews=ELSE
    if (
      info.allowsSendReviewInvitesForProduct &&
      selectedReviews.service?.ID !== defaultStatus.ID &&
      selectedReviews.product?.ID !== defaultStatus.ID
    ) {
      const parsedProductName = parseExpression(selectedReviews.product?.name || '')
      const parsedServiceName = parseExpression(selectedReviews.service?.name || '')

      let eventTypeProduct = eventTypes.find(item => item.name === parsedProductName)
      let eventTypeService = eventTypes.find(item => item.name === parsedServiceName)

      const handlePatchInviteSettings = async () => {
        await getEtrustedInviteSettings(selectedShopChannel, info, token as string).then(
          async inviteSettings =>
            await promiseAllRequest(
              inviteSettings &&
                inviteSettings.length &&
                inviteSettings.map(async invite => {
                  const isEnableProduct = invite.eventTypeId === eventTypeProduct?.id
                  const isEnableService = invite.eventTypeId === eventTypeService?.id

                  await patchInviteSettingsById(
                    selectedShopChannel,
                    info,
                    token as string,
                    invite.id as string,
                    {
                      enabled: isEnableProduct || isEnableService,
                      serviceInviteConfiguration: {
                        enabled: isEnableService,
                      },
                      productInviteConfiguration: {
                        enabled: isEnableProduct,
                      },
                    }
                  )
                })
            )
        )
      }

      if (info.allowsSendReviewInvitesForProduct && !eventTypeProduct) {
        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: parsedProductName,
        }).then(async eventType => {
          let delay = 1000

          const handlePatchInviteSetting = async () => {
            const body = {
              serviceInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
              productInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
              enabled: false,
            }
            await patchInviteSettings(
              selectedShopChannel,
              info,
              token as string,
              eventType.id,
              body
            )
              .then(async () => {
                eventTypeProduct = eventType
                if (!!eventTypeProduct && !!eventTypeService) {
                  handlePatchInviteSettings()
                }
              })
              .catch(err => {
                // eslint-disable-next-line no-console
                if (delay >= 8000) return console.error(err)

                setTimeout(() => {
                  handlePatchInviteSetting()
                }, delay)
                delay = 2 * delay
              })
          }
          handlePatchInviteSetting()
        })
      }

      if (!eventTypeService) {
        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: parsedServiceName,
        }).then(async eventType => {
          let delay = 1000

          const handlePatchInviteSetting = async () => {
            const body = {
              serviceInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
              productInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
              enabled: false,
            }
            await patchInviteSettings(
              selectedShopChannel,
              info,
              token as string,
              eventType.id,
              body
            )
              .then(async () => {
                eventTypeService = eventType
                if (!!eventTypeProduct && !!eventTypeService) {
                  handlePatchInviteSettings()
                }
              })
              .catch(err => {
                // eslint-disable-next-line no-console
                if (delay >= 8000) return console.error(err)

                setTimeout(() => {
                  handlePatchInviteSetting()
                }, delay)
                delay = 2 * delay
              })
          }
          handlePatchInviteSetting()
        })
      }

      if (!!eventTypeProduct && !!eventTypeService) {
        handlePatchInviteSettings()
      }
    }

    if (!info.allowsSendReviewInvitesForProduct) {
      handeleRequestsForSelectedReview(selectedReviews.service?.name || '')
    }

    dispatchAction({
      action: EVENTS.SAVE_USED_ORDER_STATUSES,
      payload: { eTrustedChannelRef, salesChannelRef, activeStatus: selectedReviews },
    })
  },
})
