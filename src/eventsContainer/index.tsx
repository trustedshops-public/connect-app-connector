/* eslint-disable no-console */
import { VNode } from 'preact'
import { FC, useEffect } from 'preact/compat'
import { dispatchAction, EVENTS, registerEvents } from '@/eventsLib'
import { IChannelTS, IMappedChannel } from '@/store/channel/types'
import { IAuthRequest } from '@/store/auth/types'
import { IWidgetLocation } from '@/store/widgets/types'
import { IUserInfo } from '@/store/info/types'
import { ITrustbadge, IWidgets } from '@/baseLayers/types'
import useStore from '@/store/useStore'
import { route } from 'preact-router'

const EventsContainer: FC<{ children: VNode }> = ({ children }) => {
  const {
    getTrustbadgeData,
    setIsLoadingBL,
    setLanguage,
    getInfoOfSystem,
    getShopChannels,
    getMappedChannels,
    setIsDisconnectLoading,
    refresh,
    setIsAuthLoading,
    logout,
    getWidgetsFromBL,
    getWidgetLocation,
    setAvailableProductIds,
    setInvitesForProducts,
    setIsLoadingInvitesForProducts,
    addInToastList,
    setUseEstimatedDeliveryDate,
    setUseEventsByOrderStatusShipped,
    getOrderStatus,
  } = useStore()

  useEffect(() => {
    const unsubscribingFromEvents = registerEvents({
      [EVENTS.SET_LOCALE]: (event: { payload: string }) => setLanguage(event.payload),
      // [EVENTS.GET_ORDER_STATUS]: () => getOrderStatus(),
      [EVENTS.SET_SALES_CHANNELS_PROVIDED]: (event: { payload: IChannelTS[] }) => {
        getShopChannels(event.payload)
      },
      [EVENTS.SET_MAPPED_CHANNELS]: (event: { payload: IMappedChannel[] }) => {
        try {
          getMappedChannels(event.payload)
        } catch (error) {
          console.log(error)
        }
      },

      [EVENTS.SET_CREDENTIALS_PROVIDED]: (event: { payload: IAuthRequest }) => {
        if (!!event.payload.clientId && !!event.payload.clientSecret) {
          refresh(event.payload)
        } else {
          setIsAuthLoading(false)
          logout()
        }
      },
      [EVENTS.SET_TRUSTBADGE_CONFIGURATION_PROVIDED]: (event: { payload: ITrustbadge }) =>
        getTrustbadgeData(event.payload || { children: [] }),

      // WIDGET
      [EVENTS.SET_WIDGET_PROVIDED]: (event: { payload: IWidgets }) =>
        getWidgetsFromBL(event.payload),
      [EVENTS.SET_LOCATION_FOR_WIDGET]: (event: { payload: IWidgetLocation[] }) =>
        getWidgetLocation(event.payload),
      [EVENTS.SET_AVAILABLE_PRODUCT_IDENTIFIERS]: (event: { payload: IWidgetLocation[] }) =>
        setAvailableProductIds(event.payload),

      [EVENTS.SET_PRODUCT_REVIEW_FOR_CHANNEL]: (event: { payload: Nullable<IMappedChannel> }) =>
        setInvitesForProducts(event.payload),

      [EVENTS.SET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL]: (event: {
        payload: Nullable<{ id: string; isUseDateToSendReviewInvites?: boolean; active?: boolean }>
      }) => setUseEstimatedDeliveryDate(event.payload),

      [EVENTS.SET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL]: (event: {
        payload: Nullable<{ id: string; active: boolean }>
      }) => setUseEventsByOrderStatusShipped(event.payload),

      [EVENTS.SET_EXPORT_PREVIOUS_ORDER]: () => setIsLoadingInvitesForProducts(false),

      [EVENTS.SET_DISCONNECTED]: () => {
        logout()
        setIsDisconnectLoading(false)
      },
      [EVENTS.SET_INFORMATION_OF_SYSTEM]: (event: { payload: IUserInfo }) => {
        clearInterval(INTERVAL)
        getInfoOfSystem(event.payload)
      },
      [EVENTS.NOTIFICATION]: (event: {
        payload: { event: string; message: string; status: number | string; type: string }
      }) => {
        const isNotifi = event.payload.event
          ? (Object.values(EVENTS) as string[]).includes(event.payload?.event)
          : false
        if (isNotifi) {
          addInToastList({
            event: event.payload.event || '',
            text: event.payload.message || '',
            status: event.payload.status.toString(),
            errorText: '',
            type: event.payload.type,
          })
          closeAllLoadings()
        }
      },
      [EVENTS.ERROR]: (event: { payload: { message: string } }) => {
        console.warn(`${event.payload.message}`)
      },
      [EVENTS.CLOSE_CONNECTOR]: () => {
        unsubscribingFromEvents()
        route('/')
        console.log('Connector unsubsribe')
      },
    })

    dispatchAction({ action: EVENTS.GET_INFORMATION_OF_SYSTEM, payload: null })
    dispatchAction({ action: EVENTS.GET_LOCALE, payload: null })

    const INTERVAL = setInterval(() => {
      dispatchAction({ action: EVENTS.GET_INFORMATION_OF_SYSTEM, payload: null })
    }, 2000)

    return () => {
      unsubscribingFromEvents()
    }
  }, [])

  const closeAllLoadings = () => {
    setIsLoadingBL(false)
    setIsDisconnectLoading(false)
    setIsLoadingInvitesForProducts(false)
    setIsAuthLoading(false)
  }

  return children
}

export default EventsContainer
