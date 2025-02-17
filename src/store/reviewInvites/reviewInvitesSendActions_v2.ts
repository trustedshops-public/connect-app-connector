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
import { IMappedChannel } from '../channel/types'
import { IUserInfo } from '../info/types'

const defaultStatus = {
  name: CHECKOUT_TYPE,
  ID: CHECKOUT_TYPE, // You might want to use a unique ID here, like a string
  event_type: CHECKOUT_TYPE,
}

const handleDefaultOrderStatusUpdate = async (
  element: IMappedChannel,
  infoOfSystem: IUserInfo,
  token: string
) => {
  const eventTypes = await getEtrustedIEventType(element, infoOfSystem, token as string)
  const inviteSettingsByChannel = await getEtrustedInviteSettings(
    element,
    infoOfSystem,
    token as string
  )

  inviteSettingsByChannel.forEach(invite => {
    const eventType = eventTypes.find(event => event.id === invite.eventTypeId)
    const isEnableProduct =
      eventType?.name === defaultStatus.name && infoOfSystem.allowsSendReviewInvitesForProduct

    const isEnableService = eventType?.name === defaultStatus.name

    ;(async () => {
      await patchInviteSettingsById(element, infoOfSystem, token as string, invite.id as string, {
        enabled: true,
        serviceInviteConfiguration: {
          enabled: isEnableService,
        },
        productInviteConfiguration: {
          enabled: isEnableProduct,
        },
      })
    })()
  })

  dispatchAction({
    action: EVENTS.SAVE_USED_ORDER_STATUSES,
    payload: {
      eTrustedChannelRef: element.eTrustedChannelRef,
      salesChannelRef: element.salesChannelRef,
      activeStatus: {
        product: defaultStatus,
        service: defaultStatus,
      },
    },
  })
}

export const reviewInvitesActionsStore_v2 = (
  set: SetState<AppStore>,
  get: GetState<AppStore>
): ReviewInvitesActionsStore_2 => ({
  setAvailableOrderStatuses: (value: AvilableOrderStatusesType[]) => {
    const infoOfSystem = get().infoState.infoOfSystem
    const order_status_event_type = `order_status_from_${infoOfSystem.nameOfSystem}`
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase()

    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        availableOrderStatusesAction: [
          defaultStatus,
          ...value.map(item => ({
            ...item,
            ID: item?.ID?.toString(),
            event_type: item?.event_type || order_status_event_type,
          })),
        ],
      },
    }))
  },
  setInitialOrderStatusByMapping: (selectedChannels: IMappedChannel[]) => {
    const token = get().auth.user?.access_token
    const infoOfSystem = get().infoState.infoOfSystem
    const initialSelectedChannels = get().channelState.initialSelectedChannels

    selectedChannels.forEach(element => {
      if (
        initialSelectedChannels.some(
          item =>
            item.eTrustedChannelRef === element.eTrustedChannelRef &&
            item.salesChannelRef === element.salesChannelRef
        )
      ) {
        return
      }

      (async () => {
        await handleDefaultOrderStatusUpdate(element, infoOfSystem, token as string)
      })()
    })
  },

  setUsedOrderStatuses: (value: PayloadUsedOrders) => {
    const infoOfSystem = get().infoState.infoOfSystem
    const selectedShopChannel = get().channelState.selectedShopChannels
    const token = get().auth.user?.access_token
    const order_status_event_type = `order_status_from_${infoOfSystem.nameOfSystem}`
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase()

    if (
      value.eTrustedChannelRef !== selectedShopChannel.eTrustedChannelRef ||
      value.salesChannelRef !== selectedShopChannel.salesChannelRef
    ) {
      return
    }

    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        selectedReviews: {
          product: {
            ...(value?.activeStatus?.product || defaultStatus),
            event_type:
              value?.activeStatus?.product?.ID !== defaultStatus.ID
                ? order_status_event_type
                : defaultStatus.event_type,
          } as AvilableOrderStatusesType,
          service: {
            ...(value?.activeStatus?.service || defaultStatus),
            event_type:
              value?.activeStatus?.service?.ID !== defaultStatus.ID
                ? order_status_event_type
                : defaultStatus.event_type,
          } as AvilableOrderStatusesType,
        },
        initialSelectedReviews: {
          product: {
            ...(value?.activeStatus?.product || defaultStatus),
            event_type:
              value?.activeStatus?.product?.ID !== defaultStatus.ID
                ? order_status_event_type
                : defaultStatus.event_type,
          } as AvilableOrderStatusesType,
          service: {
            ...(value?.activeStatus?.service || defaultStatus),
            event_type:
              value?.activeStatus?.service?.ID !== defaultStatus.ID
                ? order_status_event_type
                : defaultStatus.event_type,
          } as AvilableOrderStatusesType,
        },
      },
    }))

    if (!value || !value.activeStatus) {
      handleDefaultOrderStatusUpdate(selectedShopChannel, infoOfSystem, token as string)
    }
  },
  getEventTypesFromApi_v2: async (): Promise<void> => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
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
      // eslint-disable-next-line no-console
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
    try {
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
          },
        }))
        Promise.all(f).then(() => get().getEventTypesFromApi_v2())
      }

      const callPromise = async (
        inviteSettings: InviteSettingsByChannelType[],
        newEventType?: EventType
      ): Promise<void> => {
        promiseAllRequest(
          inviteSettings.map(async invite => {
            const eventType = (newEventType?.id ? [...eventTypes, newEventType] : eventTypes).find(
              event => event.id === invite.eventTypeId
            )
            const isEnableProduct =
              eventType?.name === selectedReviewsProductType &&
              info.allowsSendReviewInvitesForProduct

            const isEnableService = eventType?.name === selectedReviewsServiceType

            await patchInviteSettingsById(
              selectedShopChannel,
              info,
              token as string,
              invite.id as string,
              {
                enabled: true,
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
      }

      let delay = 1000

      const handlePatchInviteSetting = async (eventType: EventType) => {
        const body = {
          serviceInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
          productInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
          enabled: true,
        }
        await patchInviteSettings(selectedShopChannel, info, token as string, eventType.id, body)
          .then(async () => {
            await getEtrustedInviteSettings(selectedShopChannel, info, token as string).then(
              async responce => await callPromise(responce, eventType)
            )
          })
          .catch(err => {
            if (delay >= 8000) {
              // eslint-disable-next-line no-console
              console.error(err)
              return
            }

            setTimeout(() => {
              handlePatchInviteSetting(eventType)
            }, delay)
            delay = 2 * delay
          })
      }

      const selectedReviewsServiceType = selectedReviews.service?.event_type as string
      const selectedReviewsProductType = selectedReviews.product?.event_type as string
      const eventTypeServiceType = eventTypes.find(item => item.name === selectedReviewsServiceType)
      const eventTypeProductType = eventTypes.find(item => item.name === selectedReviewsProductType)
      const order_status_event_type = `order_status_from_${info.nameOfSystem}`
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase()

      if (!eventTypeServiceType || !eventTypeProductType) {
        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: order_status_event_type,
        }).then(async eventType => {
          await handlePatchInviteSetting(eventType)
        })
      } else {
        await callPromise(inviteSettingsByChannel)
      }

      dispatchAction({
        action: EVENTS.SAVE_USED_ORDER_STATUSES,
        payload: { eTrustedChannelRef, salesChannelRef, activeStatus: selectedReviews },
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
})
