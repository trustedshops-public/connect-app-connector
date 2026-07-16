import { GetState, SetState } from 'zustand'
import { dispatchAction, EVENTS } from '@/eventsLib'
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

  updateStructuredMarkupEnabled: (enabled: boolean) => {
    const state = get()
    const { selectedShopChannels } = state.channelState
    const { trustbadgeId } = state.trustbadgeState

    if (EVENTS.SAVE_STRUCTURED_MARKUP_CONFIGURATION) {
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

    set(store => ({
      structuredMarkupState: {
        ...store.structuredMarkupState,
        structuredMarkupEnabled: enabled,
      },
    }))
  },

  clearStructuredMarkupState: () => {
    set(() => ({
      structuredMarkupState: { ...initialState },
    }))
  },
})
