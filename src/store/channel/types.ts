export interface IChannelTS {
  id: string
  createdAt?: string
  updatedAt?: string
  name: string
  address?: string
  url: string
  logoUrl?: string
  accountRef: string
  locale: string
  state?: string
}

export interface IMappedChannel {
  eTrustedChannelRef: string
  eTrustedLocale: string
  eTrustedName: string
  eTrustedUrl: string
  eTrustedAccountRef: string
  salesChannelRef: string
  salesChannelLocale: string
  salesChannelName: string
  salesChannelUrl: string
}

export interface IChannelState {
  isLoadingSave: boolean
  shopChannels: Array<IChannelTS>
  selectedShopChannels: IMappedChannel
  mappedChannels: Array<IMappedChannel>
  channelsFromTSC: Array<IChannelTS>
  selectedChannels: IMappedChannel[]
  initialSelectedChannels: IMappedChannel[]
  selectedeTrustedChannelRef: string
  isChannelsLoading: boolean
  isDisconnectLoading: boolean
  showChannelModal: boolean
}
export interface IChannelStore {
  channelState: IChannelState
  setIsLoadingSave: (value: boolean) => void
  getShopChannels: (channels: Array<IChannelTS>) => void
  setSelectedShopChennel: (value: string | number) => void
  getMappedChannels: (channels: Array<IMappedChannel>) => void
  getTSChannels: () => void
  setSelectedChannels: (mappedChannels: IMappedChannel[]) => void
  setIsChannelsLoading: (value: boolean) => void
  setIsDisconnectLoading: (value: boolean) => void
  setShowChannelModal: (value: boolean) => void
  setIsChannelsFromTSCRequestAuthError: (value: boolean) => void
  clearChannelState: () => void
}
