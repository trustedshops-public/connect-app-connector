/* eslint-disable @typescript-eslint/no-unused-vars */
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
  InviteSettingsByChannelType,
  ReviewInvitesActionsStore_2,
} from './types'

// const CHECKOUT_TYPE = 'checkout'
// const ORDER_SHIPPED_TYPE = 'order_shipped'

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
        selectedReviews: { product: defaultStatus, service: defaultStatus },
      },
    }))
  },
  getEventTypesFromApi_v2: async () => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        eventTypesAreLoadedFromAPI: false,
        estimatedDeliveryAreLoadedFromBL: false,
        orderStatusShippedAreLoadedFromBl: false,
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

    //case1: Service Reviews=Checkout AND Product Reviews=Checkout
    if (
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
              enabled: true,
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

    const parseExpression = (name: string) =>
      `${name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase()}_from_${info.nameOfSystem}`

    //case2: Service Reviews=ELSE AND Product Reviews=Checkout
    if (
      selectedReviews.service?.ID !== defaultStatus.ID &&
      selectedReviews.product?.ID === defaultStatus.ID
    ) {
      const parsedName = parseExpression(selectedReviews.service?.name)
      const eventType = eventTypes.find(item => item.name === parsedName)
      const checkoutEventType = eventTypes.find(item => item.name === CHECKOUT_TYPE)

      const callPromise = (inviteSettings: InviteSettingsByChannelType[], eventTypeId: string) =>
        promiseAllRequest(
          inviteSettings &&
            inviteSettings.length &&
            inviteSettings.map(async invite => {
              const isEventsByOrderStatusShipped = invite.eventTypeId === eventTypeId
              const isCheckoutType = invite.eventTypeId === checkoutEventType?.id

              if (isEventsByOrderStatusShipped) {
                await patchInviteSettingsById(
                  selectedShopChannel,
                  info,
                  token as string,
                  invite.id as string,
                  {
                    enabled: true, //TODO: ??
                    serviceInviteConfiguration: {
                      enabled: true,
                    },
                    productInviteConfiguration: {
                      enabled: false,
                    },
                  }
                )
              } else if (isCheckoutType) {
                await patchInviteSettingsById(
                  selectedShopChannel,
                  info,
                  token as string,
                  invite.id as string,
                  {
                    enabled: true, //TODO: ??
                    serviceInviteConfiguration: {
                      enabled: false,
                    },
                    productInviteConfiguration: {
                      enabled: true,
                    },
                  }
                )
              } else {
                await patchInviteSettingsById(
                  selectedShopChannel,
                  info,
                  token as string,
                  invite.id as string,
                  {
                    enabled: false, //TODO: ??
                    serviceInviteConfiguration: {
                      enabled: false,
                    },
                    productInviteConfiguration: {
                      enabled: false,
                    },
                  }
                )
              }
            })
        )

      if (!eventType) {
        console.log(selectedReviews.service?.name, eventType, parsedName)

        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: parsedName,
        }).then(async eventType => {
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
        console.log(selectedReviews.service?.name, eventType, parsedName)

        callPromise(inviteSettingsByChannel, eventType.id)
      }
    }
  },
})
