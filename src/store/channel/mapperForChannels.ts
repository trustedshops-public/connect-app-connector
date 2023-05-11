import { IChannelTS, IMappedChannel } from './types'

export const getMappedChannels = (
  shopChannels: IChannelTS[],
  channelsFromTSC: IChannelTS[]
): IMappedChannel[] => {
  if (channelsFromTSC.length === 1 && shopChannels.length === 1) {
    return [
      {
        eTrustedChannelRef: channelsFromTSC[0].id,
        eTrustedLocale: channelsFromTSC[0].locale,
        eTrustedName: channelsFromTSC[0].name,
        eTrustedUrl: channelsFromTSC[0].url,
        eTrustedAccountRef: channelsFromTSC[0].accountRef,
        salesChannelRef: shopChannels[0].id,
        salesChannelLocale: shopChannels[0].locale,
        salesChannelName: shopChannels[0].name,
        salesChannelUrl: shopChannels[0].url,
      },
    ]
  }
  return channelsFromTSC.reduce((acc: IMappedChannel[], item): IMappedChannel[] => {
    const index = shopChannels.findIndex(
      channel => channel.url === item.url && channel.locale === item.locale
    )
    if (index >= 0) {
      acc.push({
        eTrustedChannelRef: item.id,
        eTrustedLocale: item.locale,
        eTrustedName: item.name,
        eTrustedUrl: item.url,
        eTrustedAccountRef: item.accountRef,
        salesChannelRef: shopChannels[index].id,
        salesChannelLocale: shopChannels[index].locale,
        salesChannelName: shopChannels[index].name,
        salesChannelUrl: shopChannels[index].url,
      })
    }
    return acc
  }, [])
}

export const getSelectedAndMappedChannels = (
  shopChannel: IChannelTS,
  channelFromTSC: Nullable<IChannelTS>,
  selectedChannels: IMappedChannel[]
): IMappedChannel[] => {
  if (!channelFromTSC) {
    return selectedChannels.filter(item => item.salesChannelRef !== shopChannel.id)
  }
  const mappedSelectedChannel = {
    eTrustedChannelRef: channelFromTSC.id,
    eTrustedLocale: channelFromTSC.locale,
    eTrustedName: channelFromTSC.name,
    eTrustedUrl: channelFromTSC.url,
    eTrustedAccountRef: channelFromTSC.accountRef,
    salesChannelRef: shopChannel.id,
    salesChannelLocale: shopChannel.locale,
    salesChannelName: shopChannel.name,
    salesChannelUrl: shopChannel.url,
  }

  const copySelectedChannel = [...selectedChannels]
  const idx = copySelectedChannel.findIndex(
    item => item.salesChannelRef === mappedSelectedChannel.salesChannelRef
  )
  if (idx >= 0) {
    copySelectedChannel[idx] = mappedSelectedChannel
  } else {
    copySelectedChannel.push(mappedSelectedChannel)
  }
  return copySelectedChannel
}
