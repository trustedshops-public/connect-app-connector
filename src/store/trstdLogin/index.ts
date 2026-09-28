import { GetState, SetState } from 'zustand'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { postTrstdLoginConfiguration, putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import { getTrstdLoginDefault } from './getTrstdLoginDefault'
import { selectAllState } from '../selector'
import { AppStore } from '../useStore'
import {
  ITrstdLoginState,
  ITrstdLoginStore,
  ITrstdLogin,
  ITrstdLoginCustomization,
  ITrstdLoginLocation,
} from './types'
import { IMappedChannel } from '../channel/types'

const emptyData: ITrstdLogin = {
  id: '',
  salesChannelRef: '',
  configuration: {},
}

/**
 * Whether a configuration the base layer provided is about a channel other than
 * the one that is open. Only an answer naming a *different mapped* channel counts:
 * an answer without a sales channel ref, or with one the connector does not know,
 * belongs to the request that was just made for the selected channel.
 */
const belongsToAnotherChannel = (
  data: ITrstdLogin | null,
  selectedChannel: IMappedChannel,
  mappedChannels: IMappedChannel[],
): boolean => {
  const ref = data?.salesChannelRef
  if (!ref || !selectedChannel.salesChannelRef || ref === selectedChannel.salesChannelRef) {
    return false
  }
  return mappedChannels.some(channel => channel.salesChannelRef === ref)
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
    get().setIsLoadingBL(true)
    set(store => ({
      trstdLoginState: {
        ...store.trstdLoginState,
        isLoadingBL: false,
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

  /**
   * Applies the configuration the base layer provided for the selected channel.
   *
   * Two rules keep one channel's placement off the others:
   * - an answer that belongs to another mapped channel is dropped. The base layer
   *   answers asynchronously, so switching channels while a request is in flight
   *   would otherwise leave the previous channel's placement standing in the form
   *   of the channel now open, ready to be saved onto it.
   * - an answer carrying only a `customization` is applied as well. Requiring
   *   `configuration.integration` discarded it and kept whatever was in the store.
   */
  getTrstdLoginData: (data: ITrstdLogin) => {
    const { selectedShopChannels, mappedChannels } = get().channelState

    const stopLoading = (): void => {
      set(store => ({
        trstdLoginState: {
          ...store.trstdLoginState,
          isLoadingBL: false,
        },
      }))
    }

    if (belongsToAnotherChannel(data, selectedShopChannels, mappedChannels)) {
      stopLoading()
      return
    }

    if (!data?.configuration?.integration && !data?.customization) {
      stopLoading()
      return
    }

    // the request was addressed to the selected channel, so an answer that does
    // not name a channel belongs to it
    const dataForChannel: ITrstdLogin = {
      ...data,
      salesChannelRef: data.salesChannelRef || selectedShopChannels.salesChannelRef,
    }

    set(store => ({
      trstdLoginState: {
        ...store.trstdLoginState,
        trstdLoginData: dataForChannel,
        initialTrstdLoginData: JSON.parse(JSON.stringify(dataForChannel)),
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
      let integrationId = ''
      let trstdLoginEnabled = enabled

      if (enabled) {
        const response = await postTrstdLoginConfiguration(info, token as string, [
          {
            channelId: selectedShopChannels.eTrustedChannelRef,
            trstdLoginEnabled: enabled,
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

        trstdLoginEnabled = response.trstdLoginEnabled ?? enabled
        integrationId = response.integrationId || ''
      }

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
        // the selected channel wins: the loaded configuration can still name the
        // channel it was read from, while the flag being saved belongs to the
        // channel that is open
        salesChannelRef: selectedShopChannels.salesChannelRef || currentData.salesChannelRef,
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
    } catch {
      set(store => ({
        trstdLoginState: {
          ...store.trstdLoginState,
          isLoadingBL: false,
        },
      }))
    }
  },

  saveTrstdLoginCustomization: (customization: ITrstdLoginCustomization) => {
    const state = get()
    const { selectedShopChannels } = state.channelState
    const token = state.auth.user?.access_token
    const currentData = state.trstdLoginState.trstdLoginData

    // without a channel the shop system has nothing to attribute the placement
    // to and would fall back to a channel of its own choosing
    if (!selectedShopChannels.salesChannelRef) return

    const updatedData: ITrstdLogin = {
      ...currentData,
      // Stamped on the data itself, not only on the event payload below: the
      // configuration call sends the whole state, so without this the placement
      // would reach the configuration API carrying the channel the loaded
      // configuration was read from.
      salesChannelRef: selectedShopChannels.salesChannelRef,
      customization,
    }

    const supportsSaveEvent = !!EVENTS.SAVE_TRSTDLOGIN_CONFIGURATION

    // loading stays on until the shop system confirms the save via
    // SET_TRSTDLOGIN_CONFIGURATION_PROVIDED (handled in eventsContainer)
    set(store => ({
      trstdLoginState: {
        ...store.trstdLoginState,
        trstdLoginData: updatedData,
        initialTrstdLoginData: JSON.parse(JSON.stringify(updatedData)),
        isLoadingBL: supportsSaveEvent,
      },
    }))

    // Always addressed to the selected channel, like updateTrstdLoginEnabled does:
    // the placement belongs to the channel being edited, not to whichever channel
    // the currently loaded configuration was last read from.
    if (supportsSaveEvent) {
      dispatchAction({
        action: EVENTS.SAVE_TRSTDLOGIN_CONFIGURATION,
        payload: {
          ...updatedData,
          eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
          salesChannelRef: selectedShopChannels.salesChannelRef,
        },
      })
    }

    // the placement is part of the saved configuration, like the enabled flag
    handleEtrustedConfiguration(
      token,
      selectAllState(get()),
      'trstdLogin',
      putEtrustedConfiguration,
    )
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
