import { GetState, SetState } from 'zustand'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { postTrstdLoginConfiguration, putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import { getTrstdLoginDefault } from './getTrstdLoginDefault'
import { AppStore } from '../useStore'
import {
  ITrstdLoginState,
  ITrstdLoginStore,
  ITrstdLogin,
  ITrstdLoginLocation,
} from './types'
import { IMappedChannel } from '../channel/types'

const emptyData: ITrstdLogin = {
  id: '',
  salesChannelRef: '',
  configuration: {},
}

const initialState: ITrstdLoginState = {
  isLoadingBL: false,
  trstdLoginData: emptyData,
  initialTrstdLoginData: emptyData,
  locations: [],
}

export const trstdLoginStore = (
  set: SetState<AppStore>,
  get: GetState<AppStore>,
): ITrstdLoginStore => ({
  trstdLoginState: initialState,

  setTrstdLoginLoadingBL: (value: boolean) => {
    set(store => ({
      trstdLoginState: {
        ...store.trstdLoginState,
        isLoadingBL: value,
      },
    }))
  },

  getTrstdLoginConfiguration: (channel: IMappedChannel) => {
    set(store => ({
      trstdLoginState: {
        ...store.trstdLoginState,
        isLoadingBL: true,
      },
    }))

    const payload = {
      id: channel.eTrustedChannelRef,
      salesChannelRef: channel.salesChannelRef,
      eTrustedChannelRef: channel.eTrustedChannelRef,
    }

    if (EVENTS.GET_TRSTDLOGIN_CONFIGURATION_PROVIDED) {
      dispatchAction({
        action: EVENTS.GET_TRSTDLOGIN_CONFIGURATION_PROVIDED,
        payload,
      })
    }
    if (EVENTS.GET_LOCATION_FOR_TRSTDLOGIN) {
      dispatchAction({
        action: EVENTS.GET_LOCATION_FOR_TRSTDLOGIN,
        payload,
      })
    }
  },

  getTrstdLoginData: (data: ITrstdLogin) => {
    if (data?.configuration?.integration) {
      set(store => ({
        trstdLoginState: {
          ...store.trstdLoginState,
          trstdLoginData: data,
          initialTrstdLoginData: JSON.parse(JSON.stringify(data)),
          isLoadingBL: false,
        },
      }))
      return
    }

    set(store => ({
      trstdLoginState: {
        ...store.trstdLoginState,
        isLoadingBL: false,
      },
    }))
  },

  setTrstdLoginLocations: (locations: ITrstdLoginLocation[]) => {
    set(store => ({
      trstdLoginState: {
        ...store.trstdLoginState,
        locations,
      },
    }))
  },

  updateTrstdLoginEnabled: async (enabled: boolean) => {
    const state = get()
    const { selectedShopChannels } = state.channelState
    const token = state.auth.user?.access_token
    const info = state.infoState.infoOfSystem

    set(store => ({
      trstdLoginState: {
        ...store.trstdLoginState,
        isLoadingBL: true,
      },
    }))

    try {
      const response = await postTrstdLoginConfiguration(info, token as string, [
        {
          channelId: selectedShopChannels.eTrustedChannelRef,
          enableTrustedLogin: enabled,
        },
      ])

      if (response.error) {
        get().addInToastList({
          event: 'TRSTD_LOGIN_CONFIGURATION',
          text: response.error,
          status: 'error',
          errorText: response.error,
          type: 'save',
        })
        set(store => ({
          trstdLoginState: {
            ...store.trstdLoginState,
            isLoadingBL: false,
          },
        }))
        return
      }

      const trstdLoginEnabled = response.trstdLoginEnabled ?? enabled
      const integrationId = response.integrationId || ''

      const currentData = get().trstdLoginState.trstdLoginData
      const currentConfig = currentData.configuration
      const { locations } = get().trstdLoginState

      const hasConfig = !!currentConfig?.integration
      const baseConfig = hasConfig
        ? currentConfig
        : getTrstdLoginDefault(
            selectedShopChannels.salesChannelRef,
          ).configuration

      const existingIntegrationId =
        currentConfig?.script?.attributes?.['data-integration-id']?.value || ''
      const resolvedIntegrationId = integrationId || existingIntegrationId

      const currentLocation = baseConfig?.integration?.location
      const location =
        trstdLoginEnabled && (!currentLocation?.id) && locations.length > 0
          ? locations[0]
          : currentLocation || { id: '', name: '' }

      const updatedConfig = {
        ...baseConfig,
        script: {
          ...baseConfig?.script,
          attributes: {
            ...baseConfig?.script?.attributes,
            'data-integration-id': {
              value: resolvedIntegrationId,
              attributeName: 'data-integration-id',
            },
          },
        },
        integration: {
          applicationType: 'trstd_login',
          tag: 'trstd-login',
          ...baseConfig?.integration,
          trstdLoginEnabled,
          location,
        },
      }

      const updatedData: ITrstdLogin = {
        ...currentData,
        id: resolvedIntegrationId,
        salesChannelRef: currentData.salesChannelRef || selectedShopChannels.salesChannelRef,
        configuration: updatedConfig,
      }

      set(store => ({
        trstdLoginState: {
          ...store.trstdLoginState,
          trstdLoginData: updatedData,
          initialTrstdLoginData: JSON.parse(JSON.stringify(updatedData)),
          isLoadingBL: false,
        },
      }))

      const { trstdLoginData } = get().trstdLoginState

      if (EVENTS.SAVE_TRSTDLOGIN_CONFIGURATION) {
        dispatchAction({
          action: EVENTS.SAVE_TRSTDLOGIN_CONFIGURATION,
          payload: {
            ...trstdLoginData,
            eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
            salesChannelRef: selectedShopChannels.salesChannelRef,
          },
        })
      }

      if (EVENTS.SET_TRSTDLOGIN_CONFIGURATION_PROVIDED) {
        dispatchAction({
          action: EVENTS.SET_TRSTDLOGIN_CONFIGURATION_PROVIDED,
          payload: trstdLoginData,
        })
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { auth: _auth, ...stateWithoutAuth } = get()
      handleEtrustedConfiguration(
        token,
        stateWithoutAuth,
        'trstdLogin',
        putEtrustedConfiguration,
      )

      get().addInToastList({
        event: 'TRSTD_LOGIN_CONFIGURATION',
        status: 'success',
        type: 'save',
      })
    } catch(error: any) {
      console.error(
        'Error updating trstd login configuration',
        error.response?.data,
      )
      get().addInToastList({
        event: 'TRSTD_LOGIN_CONFIGURATION',
        status: 'error',
        type: 'save',
      })
      set(store => ({
        trstdLoginState: {
          ...store.trstdLoginState,
          isLoadingBL: false,
        },
      }))
    }
  },

  updateTrstdLoginLocation: (location: ITrstdLoginLocation) => {
    set(store => {
      const { configuration } = store.trstdLoginState.trstdLoginData
      if (!configuration?.integration) return {}

      return {
        trstdLoginState: {
          ...store.trstdLoginState,
          trstdLoginData: {
            ...store.trstdLoginState.trstdLoginData,
            configuration: {
              ...configuration,
              integration: {
                ...configuration.integration,
                location,
              },
            },
          },
        },
      }
    })
  },

  clearTrstdLoginState: () => {
    set(() => ({
      trstdLoginState: { ...initialState },
    }))
  },
})
