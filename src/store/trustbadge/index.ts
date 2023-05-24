import axios from 'axios'
import { GetState, SetState } from 'zustand'
import { getEtrustedID } from '@/api/api'
import { ITrustbadge, ITrustbadgeChildren } from '@/baseLayers/types'
import { Statuses } from '@/components/layouts/toast'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { AppStore } from '../useStore'
import { getTrustbadgeDefault } from './getTrustbadgeDefault'
import { ITrustbadgeState, ITbStore } from './types'
import { IMappedChannel } from '../channel/types'

const initialState: ITrustbadgeState = {
  isLoadingAPI: false,
  isLoadingBL: false,
  errorNotification: {} as {
    errorText: string
    status: string
  },
  trustbadgeId: '',
  trustbadgeDataChild: {} as ITrustbadgeChildren,
  initialTrustbadgeDataChild: {} as ITrustbadgeChildren,
}

export const trustbadgeStore = (set: SetState<AppStore>, get: GetState<AppStore>): ITbStore => ({
  trustbadgeState: initialState,
  clearTrustbadgeState: () => {
    set(() => ({
      trustbadgeState: {
        ...initialState,
      },
    }))
  },
  setIsLoadingAPI: (value: boolean) => {
    set(store => ({
      trustbadgeState: {
        ...store.trustbadgeState,
        isLoadingAPI: value,
      },
    }))
  },
  setIsLoadingBL: (value: boolean) => {
    set(store => ({
      trustbadgeState: {
        ...store.trustbadgeState,
        isLoadingBL: value,
      },
    }))
  },

  getTrustbadge: async (selectedShopChannel: IMappedChannel) => {
    try {
      get().setIsLoadingAPI(true)
      get().setIsLoadingBL(true)
      const token = get().auth.user?.access_token

      const info = get().infoState.infoOfSystem
      const response = await getEtrustedID(selectedShopChannel, info, token as string)
      dispatchAction({
        action: EVENTS.GET_TRUSTBADGE_CONFIGURATION_PROVIDED,
        payload: {
          id: response.tsId,
          salesChannelRef: selectedShopChannel.salesChannelRef,
          eTrustedChannelRef: selectedShopChannel.eTrustedChannelRef,
        },
      })
      set(store => ({
        ...store,
        trustbadgeState: {
          ...store.trustbadgeState,
          trustbadgeId: response.tsId,
          isLoadingAPI: false,
          errorNotification: {} as {
            errorText: string
            status: string
          },
          auth: {
            ...store.auth,
            isRelogin: false,
          },
        },
      }))
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 404) {
          const errorText = err.response.data.ErrorDescription
          set(store => ({
            trustbadgeState: {
              ...store.trustbadgeState,
              trustbadgeId: '',
              isLoadingAPI: false,
              isLoadingBL: false,
              trustbadgeDataChild: {} as ITrustbadgeChildren,
              initialTrustbadgeDataChild: {} as ITrustbadgeChildren,
              errorNotification: {
                errorText,
                status: Statuses.error,
              },
            },
          }))
        }
        if (err.response.status === 401) {
          get().reLogin()
        }
      }
    }
  },
  saveTrustbadgesAfterRemappingChannels: async channel => {
    const token = get().auth.user?.access_token

    const info = get().infoState.infoOfSystem
    const response = await getEtrustedID(channel, info, token as string)

    const defaultTRustbadge = getTrustbadgeDefault(response.tsId)
    dispatchAction({
      action: EVENTS.SAVE_TRUSTBADGE_CONFIGURATION,
      payload: {
        ...defaultTRustbadge,
        eTrustedChannelRef: channel.eTrustedChannelRef,
        salesChannelRef: channel.salesChannelRef,
      },
    })
  },

  getTrustbadgeData: (data: ITrustbadge) => {
    const tsId = get().trustbadgeState.trustbadgeId
    if (!!data.children && data.children.length) {
      const baseSrcUrl =
        process.env.VITE_NODE_ENV === 'development'
          ? 'widgets-qa.trustedshops.com'
          : 'widgets.trustedshops.com'

      const dataChild = {
        ...data.children[0],
        attributes: {
          ...data.children[0].attributes,
          src: {
            value: `//${baseSrcUrl}/js/${tsId}.js`,
            attributeName: 'src',
          },
        },
      }
      set(store => ({
        trustbadgeState: {
          ...store.trustbadgeState,
          trustbadgeDataChild: dataChild,
          initialTrustbadgeDataChild: data.children[0],
          isLoadingBL: false,
        },
      }))
      return
    }
    const selectedShopChannels = get().channelState.selectedShopChannels
    const defaultTRustbadge = getTrustbadgeDefault(tsId)
    dispatchAction({
      action: EVENTS.SAVE_TRUSTBADGE_CONFIGURATION,
      payload: {
        ...defaultTRustbadge,
        eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
        salesChannelRef: selectedShopChannels.salesChannelRef,
      },
    })
  },
  updateTrustbadgeDataFromTextaria: (data: ITrustbadgeChildren) => {
    set(store => ({
      trustbadgeState: {
        ...store.trustbadgeState,
        trustbadgeDataChild: data,
      },
    }))
  },
  updateTrustbadgeData: (obj: {
    [key: string]: { value?: string | number | boolean; attributeName?: string }
  }) => {
    set(store => ({
      trustbadgeState: {
        ...store.trustbadgeState,
        trustbadgeDataChild: {
          ...store.trustbadgeState.trustbadgeDataChild,
          attributes: {
            ...store.trustbadgeState.trustbadgeDataChild.attributes,
            ...obj,
          },
        },
      },
    }))
  },
  clearTrustbadgeData: () => {
    set(store => ({
      trustbadgeState: {
        ...store.trustbadgeState,
        trustbadgeId: '',
        trustbadgeDataChild: {} as ITrustbadgeChildren,
        initialTrustbadgeDataChild: {} as ITrustbadgeChildren,
      },
    }))
  },
})
