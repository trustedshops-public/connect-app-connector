import axios from 'axios'
import { GetState, SetState } from 'zustand'
import { getChannelsFromTSC } from '@/api/api'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { AppStore } from '../useStore'
import { IChannelState, IChannelStore, IChannelTS, IMappedChannel } from './types'

const onChangeSelectedShopChennel = (
  channels: Array<IMappedChannel>,
  id: number | string
): IMappedChannel => {
  const dataIndex = channels.findIndex(item => item.salesChannelRef === id)
  return channels[dataIndex]
}

const initialState: IChannelState = {
  isChannelsLoading: false,
  isLoadingSave: false,
  isDisconnectLoading: false,
  showChannelModal: true,
  shopChannels: [] as Array<IChannelTS>,
  mappedChannels: [] as Array<IMappedChannel>,
  selectedShopChannels: {} as IMappedChannel,
  selectedeTrustedChannelRef: '',
  channelsFromTSC: [] as Array<IChannelTS>,
  selectedChannels: [] as IMappedChannel[],
  initialSelectedChannels: [] as IMappedChannel[],
}

export const channelStore = (set: SetState<AppStore>, get: GetState<AppStore>): IChannelStore => ({
  channelState: initialState,
  clearChannelState: () => {
    set(() => ({
      channelState: {
        ...initialState,
      },
    }))
  },
  setIsChannelsLoading: (value: boolean) => {
    set(store => ({
      channelState: {
        ...store.channelState,
        isChannelsLoading: value,
      },
    }))
  },
  setShowChannelModal: (value: boolean) => {
    set(store => ({
      channelState: {
        ...store.channelState,
        showChannelModal: value,
      },
    }))
  },
  setIsLoadingSave: (value: boolean) => {
    set(store => ({
      channelState: {
        ...store.channelState,
        isLoadingSave: value,
      },
    }))
  },
  setIsDisconnectLoading: (value: boolean) => {
    set(store => ({
      channelState: {
        ...store.channelState,
        isDisconnectLoading: value,
      },
    }))
  },
  setIsChannelsFromTSCRequestAuthError: (value: boolean) => {
    set(store => ({
      channelState: {
        ...store.channelState,
        isChannelsFromTSCRequestAuthError: value,
      },
    }))
  },
  getShopChannels: (channels: Array<IChannelTS>) => {
    set(store => ({
      channelState: {
        ...store.channelState,
        shopChannels: channels || [],
      },
    }))
  },
  getMappedChannels: (channels: Array<IMappedChannel>) => {
    const channelsTS = get().channelState.channelsFromTSC
    const channelsBL = get().channelState.shopChannels
    const preSelectedChannel = get().channelState.selectedShopChannels
    const newSelectedChannel = channels.find(
      item => item.salesChannelRef === preSelectedChannel.salesChannelRef
    )

    set(store => ({
      channelState: {
        ...store.channelState,
        mappedChannels: channels || [],
        isLoadingSave: false,
      },
    }))
    if (channels && channels.length) {
      set(store => ({
        channelState: {
          ...store.channelState,
          selectedShopChannels: newSelectedChannel || channels[0],
          selectedeTrustedChannelRef:
            newSelectedChannel && newSelectedChannel.eTrustedChannelRef
              ? newSelectedChannel.eTrustedChannelRef
              : channels[0].eTrustedChannelRef,
          selectedChannels: channels,
          initialSelectedChannels: channels,
          isChannelsLoading: false,
          isLoadingSave: false,
        },
      }))
    } else {
      set(store => ({
        channelState: {
          ...store.channelState,
          selectedShopChannels: {} as IMappedChannel,
          selectedeTrustedChannelRef: '',
          initialSelectedChannels: [],
          isChannelsLoading: false,
          isLoadingSave: false,
        },
      }))
    }
    !channelsTS.length && get().getTSChannels()
    !channelsBL.length &&
      dispatchAction({ action: EVENTS.GET_SALES_CHANNELS_PROVIDED, payload: null })
  },

  setSelectedShopChennel: (id: number | string) => {
    const mappedChannels = get().channelState.mappedChannels
    const shopChannel = onChangeSelectedShopChennel(mappedChannels, id)
    set(store => ({
      channelState: {
        ...store.channelState,
        selectedShopChannels: shopChannel,
        selectedeTrustedChannelRef: shopChannel.eTrustedChannelRef,
      },
    }))
  },

  getTSChannels: async () => {
    const userInfo = get().infoState.infoOfSystem
    const token = get().auth.user?.access_token
    try {
      const response = await getChannelsFromTSC(userInfo, token as string)
      if (response.length) {
        set(store => ({
          ...store,
          channelState: {
            ...store.channelState,
            channelsFromTSC: response,
          },
          auth: {
            ...store.auth,
            isRelogin: false,
          },
        }))
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          set(store => ({
            channelState: {
              ...store.channelState,
              channelsFromTSC: [],
              isChannelsFromTSCRequestAuthError: true,
            },
          }))
        }
      }
    }
  },
  setSelectedChannels: (mappedChannels: IMappedChannel[]) => {
    set(store => ({
      channelState: {
        ...store.channelState,
        selectedChannels: mappedChannels,
      },
    }))
  },
})
