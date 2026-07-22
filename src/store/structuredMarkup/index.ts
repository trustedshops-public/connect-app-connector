import { GetState, SetState } from 'zustand'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import { selectAllState } from '../selector'
import { AppStore } from '../useStore'
import { IStructuredMarkupState, IStructuredMarkupStore } from './types'
import { IMappedChannel } from '../channel/types'

const initialState: IStructuredMarkupState = {
  structuredMarkupEnabled: false,
  isLoadingStructuredMarkup: false,
}

export const structuredMarkupStore = (
  set: SetState<AppStore>,
  get: GetState<AppStore>,
): IStructuredMarkupStore => ({
  structuredMarkupState: initialState,

  setStructuredMarkupEnabled: (value: boolean) => {
    set(store => ({
      structuredMarkupState: {
        ...store.structuredMarkupState,
        structuredMarkupEnabled: value,
        isLoadingStructuredMarkup: false,
      },
    }))
  },

  setStructuredMarkupLoading: (value: boolean) => {
    set(store => ({
      structuredMarkupState: {
        ...store.structuredMarkupState,
        isLoadingStructuredMarkup: value,
      },
    }))
  },

  getStructuredMarkupConfiguration: (channel: IMappedChannel) => {
    set(store => ({
      structuredMarkupState: {
        ...store.structuredMarkupState,
        structuredMarkupEnabled: false,
      },
    }))

    if (EVENTS.GET_STRUCTURED_MARKUP_CONFIGURATION_PROVIDED) {
      dispatchAction({
        action: EVENTS.GET_STRUCTURED_MARKUP_CONFIGURATION_PROVIDED,
        payload: {
          id: channel.eTrustedChannelRef,
          salesChannelRef: channel.salesChannelRef,
          eTrustedChannelRef: channel.eTrustedChannelRef,
        },
      })
    }
  },

  updateStructuredMarkupEnabled: (
    enabled: boolean,
    options?: { skipConfigurationCall?: boolean },
  ) => {
    const state = get()
    const { selectedShopChannels } = state.channelState
    const { trustbadgeId } = state.trustbadgeState
    const token = state.auth.user?.access_token
    const supportsStructuredMarkupEvents = !!EVENTS.SAVE_STRUCTURED_MARKUP_CONFIGURATION

    // loading stays on until the shop system confirms the save via
    // SET_STRUCTURED_MARKUP_CONFIGURATION_PROVIDED (handled in eventsContainer)
    set(store => ({
      structuredMarkupState: {
        ...store.structuredMarkupState,
        structuredMarkupEnabled: enabled,
        isLoadingStructuredMarkup: supportsStructuredMarkupEvents,
      },
    }))

    if (supportsStructuredMarkupEvents) {
      dispatchAction({
        action: EVENTS.SAVE_STRUCTURED_MARKUP_CONFIGURATION,
        payload: {
          eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
          salesChannelRef: selectedShopChannels.salesChannelRef,
          tsId: trustbadgeId,
          enabled,
        },
      })
    }

    // skipped when the caller sends its own configuration call afterwards,
    // e.g. trustbadge deactivation which already includes the updated
    // structuredMarkupState in its payload
    if (!options?.skipConfigurationCall) {
      handleEtrustedConfiguration(
        token,
        selectAllState(get()),
        'trustbadge',
        putEtrustedConfiguration,
      )
    }
  },

  clearStructuredMarkupState: () => {
    set(() => ({
      structuredMarkupState: { ...initialState },
    }))
  },
})
