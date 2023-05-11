import {
  getEtrustedIEventType,
  getEtrustedInviteSettings,
  patchInviteSettings,
  patchInviteSettingsById,
  postEtrustedIEventType,
} from '@/api/api'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { SetState, GetState } from 'zustand'
import { AppStore } from '../useStore'
import { PayloadSendReview, ReviewInvitesActionsStore } from './types'

const CHECKOUT_TYPE = 'checkout'
const ORDER_SHIPPED_TYPE = 'order_shipped'

export const reviewInvitesActionsStore = (
  set: SetState<AppStore>,
  get: GetState<AppStore>
): ReviewInvitesActionsStore => ({
  getEventTypesFromApi: async () => {
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

  changeUseTimeOfSendReviewInvites: (value: {
    isEstimatedDeliveryDate: boolean
    isEventsByOrderStatusShipped: boolean
  }) => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        typesReviewInvites: { ...store.reviewInvitesState.typesReviewInvites, ...value },
      },
    }))
  },

  setUseEstimatedDeliveryDate: (estimatedDelivery: Nullable<PayloadSendReview>) => {
    const isHaveUseDateToSendReviewInvites: boolean = Object.prototype.hasOwnProperty.call(
      estimatedDelivery,
      'isUseDateToSendReviewInvites'
    )
    const isHaveActiveKey = Object.prototype.hasOwnProperty.call(estimatedDelivery, 'active')

    const isEstimatedDeliveryDate = isHaveActiveKey
      ? (estimatedDelivery?.active as boolean)
      : isHaveUseDateToSendReviewInvites &&
        (estimatedDelivery?.isUseDateToSendReviewInvites as boolean)

    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        typesReviewInvites: {
          ...store.reviewInvitesState.typesReviewInvites,
          isEstimatedDeliveryDate,
        },
        initialDateToSendReviewInvites: {
          ...store.reviewInvitesState.initialDateToSendReviewInvites,
          isEstimatedDeliveryDate,
        },
        estimatedDeliveryAreLoadedFromBL: true,
        isLoading: false,
      },
    }))
  },

  setUseEventsByOrderStatusShipped: (orderStatusShipped: Nullable<PayloadSendReview>) => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        typesReviewInvites: {
          ...store.reviewInvitesState.typesReviewInvites,
          isEventsByOrderStatusShipped: orderStatusShipped?.active || false,
        },
        initialDateToSendReviewInvites: {
          ...store.reviewInvitesState.initialDateToSendReviewInvites,
          isEventsByOrderStatusShipped: orderStatusShipped?.active || false,
        },
        orderStatusShippedAreLoadedFromBL: true,
        isLoading: false,
      },
    }))

    if (get().reviewInvitesState.eventTypesAreLoadedFromAPI) {
      get().checkReviewEventTypes()
    }
  },

  checkReviewEventTypes: () => {
    const typesReviewInvites = get().reviewInvitesState.typesReviewInvites
    const info = get().infoState.infoOfSystem
    const eventTypes = get().reviewInvitesState.eventTypes
    const inviteSettingsByChannel = get().reviewInvitesState.inviteSettingsByChannel

    const orderShippedEventTypeId = eventTypes.find(item => item.name === ORDER_SHIPPED_TYPE)?.id
    const inveteSettingByOrderShipped = inviteSettingsByChannel.find(
      item => item.eventTypeId === orderShippedEventTypeId
    )
    const isEnableInveteSettingByOrderShipped = inveteSettingByOrderShipped?.enabled
    const isServiceInviteConfiguration =
      inveteSettingByOrderShipped?.serviceInviteConfiguration?.enabled
    const isProductInviteConfiguration =
      inveteSettingByOrderShipped?.productInviteConfiguration?.enabled

    if (
      info.allowsEventsByOrderStatus &&
      typesReviewInvites.isEventsByOrderStatusShipped &&
      !isEnableInveteSettingByOrderShipped &&
      !isServiceInviteConfiguration &&
      !isProductInviteConfiguration
    ) {
      set(store => ({
        reviewInvitesState: { ...store.reviewInvitesState, isMappedTypesErorr: true },
      }))
      return
    }

    set(store => ({
      reviewInvitesState: { ...store.reviewInvitesState, isMappedTypesErorr: false },
    }))
  },

  saveChangeUseTimeOfSendReviewInvites: async () => {
    set(store => ({ reviewInvitesState: { ...store.reviewInvitesState, isLoading: true } }))
    const typesReviewInvites = get().reviewInvitesState.typesReviewInvites
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
          eventTypesAreLoadedFromAPI: false,
        },
      }))
      Promise.all(f).then(() => get().getEventTypesFromApi())
    }

    // Checkout Type
    if (typesReviewInvites.isEstimatedDeliveryDate) {
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

    //StatusShipped
    if (typesReviewInvites.isEventsByOrderStatusShipped) {
      const orderShippedEventType = eventTypes.find(item => item.name === ORDER_SHIPPED_TYPE)

      if (orderShippedEventType) {
        promiseAllRequest(
          inviteSettingsByChannel.map(async invite => {
            const isOrderShippedEventType = invite.eventTypeId === orderShippedEventType.id
            await patchInviteSettingsById(
              selectedShopChannel,
              info,
              token as string,
              invite.id as string,
              {
                enabled: true,
                serviceInviteConfiguration: {
                  enabled: isOrderShippedEventType,
                },
                productInviteConfiguration: {
                  enabled: isOrderShippedEventType,
                },
              }
            )
          })
        )
      } else {
        await postEtrustedIEventType(selectedShopChannel, info, token as string, {
          active: true,
          name: ORDER_SHIPPED_TYPE,
        }).then(async eventType => {
          const body = {
            serviceInviteConfiguration: { sendingDelayInDays: 3, enabled: false },
            productInviteConfiguration: { sendingDelayInDays: 3, enabled: false },
            enabled: false,
          }
          await patchInviteSettings(
            selectedShopChannel,
            info,
            token as string,
            eventType.id,
            body
          ).then(async () => {
            await getEtrustedInviteSettings(selectedShopChannel, info, token as string).then(
              async responce => {
                promiseAllRequest(
                  responce &&
                    responce.length &&
                    responce.map(async invite => {
                      const isEventsByOrderStatusShipped = invite.eventTypeId === eventType.id
                      await patchInviteSettingsById(
                        selectedShopChannel,
                        info,
                        token as string,
                        invite.id as string,
                        {
                          enabled: true,
                          serviceInviteConfiguration: {
                            enabled: isEventsByOrderStatusShipped,
                          },
                          productInviteConfiguration: {
                            enabled: isEventsByOrderStatusShipped,
                          },
                        }
                      )
                    })
                )
              }
            )
          })
        })
      }
    }

    // Control Centre
    if (
      !typesReviewInvites.isEstimatedDeliveryDate &&
      !typesReviewInvites.isEventsByOrderStatusShipped
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

    if (info.allowsEstimatedDeliveryDate) {
      dispatchAction({
        action: EVENTS.SAVE_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL,
        payload: {
          eTrustedChannelRef,
          salesChannelRef,
          active: typesReviewInvites.isEstimatedDeliveryDate,
          isUseDateToSendReviewInvites: typesReviewInvites.isEstimatedDeliveryDate,
        },
      })
    }

    if (info.allowsEventsByOrderStatus) {
      dispatchAction({
        action: EVENTS.SAVE_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL,
        payload: {
          eTrustedChannelRef,
          salesChannelRef,
          active: typesReviewInvites.isEventsByOrderStatusShipped,
        },
      })
    }
  },
})
