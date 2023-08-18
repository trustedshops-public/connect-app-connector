/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  getEtrustedIEventType,
  getEtrustedInviteSettings,
  patchInviteSettingsById,
  postEtrustedIEventType,
} from '@/api/api'
import { GetState, SetState } from 'zustand'
import { AppStore } from '../useStore'
import { CHECKOUT_TYPE } from './reviewInvitesSendActions'
import {
  AvilableOrderStatusesType,
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

export const reviewInvitesActionsStore_2 = (
  set: SetState<AppStore>,
  get: GetState<AppStore>
): ReviewInvitesActionsStore_2 => ({
  setAvailableOrderStatuses: (value: AvilableOrderStatusesType[]) => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        availableOrderStatusesAction: [defaultStatus, ...value],
        // selectedReviews: { product: defaultStatus, service: defaultStatus },
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
  getEventTypesFromApi_v2: async () => {
    // set(store => ({
    //   reviewInvitesState: {
    //     ...store.reviewInvitesState,
    //     eventTypesAreLoadedFromAPI: false,
    //     estimatedDeliveryAreLoadedFromBL: false,
    //     orderStatusShippedAreLoadedFromBl: false,
    //   },
    // }))
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
          eventTypesAreLoadedFromAPI: true,
        },
      }))

      const isEstimateOrderShippedFromBL =
        infoOfSystem.allowsEventsByOrderStatus ||
        get().reviewInvitesState.orderStatusShippedAreLoadedFromBL

      if (isEstimateOrderShippedFromBL) {
        get().checkReviewEventTypes()
      }
    } catch (error) {}
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
    // set(store => ({ reviewInvitesState: { ...store.reviewInvitesState, isLoading: true } }))
    const selectedReviews = get().reviewInvitesState.selectedReviews
    const token = get().auth.user?.access_token
    const eTrustedChannelRef = get().channelState.selectedShopChannels.eTrustedChannelRef
    const salesChannelRef = get().channelState.selectedShopChannels.salesChannelRef
    const selectedShopChannel = get().channelState.selectedShopChannels
    const info = get().infoState.infoOfSystem
    const eventTypes = get().reviewInvitesState.eventTypes
    const inviteSettingsByChannel = get().reviewInvitesState.inviteSettingsByChannel

    const promiseAllRequest = (f: any) => {
      // set(store => ({
      //   reviewInvitesState: {
      //     ...store.reviewInvitesState,
      //     eventTypesAreLoadedFromAPI: false,
      //   },
      // }))
      Promise.all(f).then(() => get().getEventTypesFromApi_v2())
    }

    const parseExpression = (name: string) =>
      `${name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase()}_from_${info.nameOfSystem}`

    const callPromise = (inviteSettings: InviteSettingsByChannelType[], eventTypeId: string) =>
      promiseAllRequest(
        inviteSettings &&
          inviteSettings.length &&
          inviteSettings.map(async invite => {
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
          })
      )

    const handeleRequestsForSelectedReview = async (name: string) => {
      const parsedName = defaultStatus.name === name ? name : parseExpression(name)
      const eventType = eventTypes.find(item => item.name === parsedName)

      if (!eventType) {
        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: parsedName,
        }).then(async eventType => {
          // const inviteSettingsByChannel = await getEtrustedInviteSettings(
          //   selectedShopChannel,
          //   info,
          //   token as string
          // )
          // const eventTypes = await getEtrustedIEventType(selectedShopChannel, info, token as string)

          // set(store => ({
          //   reviewInvitesState: {
          //     ...store.reviewInvitesState,
          //     eventTypes,
          //     inviteSettingsByChannel,
          //     eventTypesAreLoadedFromAPI: true,
          //   },
          // }))
          // await getEtrustedInviteSettings(selectedShopChannel, info, token as string).then(
          //   async responce => await callPromise(responce, eventType.id)
          // )
          const body = {
            serviceInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
            productInviteConfiguration: { sendingDelayInDays: 5, enabled: false },
            enabled: false,
          }
          await patchInviteSettingsById(
            selectedShopChannel,
            info,
            token as string,
            eventType.id,
            body
          ).then(async () => {
            await getEtrustedInviteSettings(selectedShopChannel, info, token as string).then(
              async responce => await callPromise(responce, eventType.id)
            )
          })
        })
      } else {
        callPromise(inviteSettingsByChannel, eventType.id)
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

      if (!eventTypeProduct) {
        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: parsedProductName,
        }).then(async eventType => {
          await get().getEventTypesFromApi_v2() //TO DO
          eventTypeProduct = { ...eventType }
        })
      } else if (!eventTypeService) {
        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: parsedServiceName,
        }).then(async eventType => {
          await get().getEventTypesFromApi_v2()
          eventTypeService = { ...eventType }
        })
      }
      promiseAllRequest(
        inviteSettingsByChannel.map(async invite => {
          const isEventTypeProduct = invite.eventTypeId === eventTypeProduct?.id
          const isEventTypeService = invite.eventTypeId === eventTypeService?.id

          await patchInviteSettingsById(
            selectedShopChannel,
            info,
            token as string,
            invite.id as string,
            {
              enabled: isEventTypeProduct || isEventTypeService,
              serviceInviteConfiguration: {
                enabled: isEventTypeService,
              },
              productInviteConfiguration: {
                enabled: isEventTypeProduct,
              },
            }
          )
        })
      )
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
