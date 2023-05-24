import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { IChannelTS, IMappedChannel } from '@/store/channel/types'
import { IWidgetApi } from '@/store/widgets/types'
import { IUserInfo } from '@/store/info/types'
import { EventType, InviteSettingsByChannelType } from '@/store/reviewInvites/types'

const PROXY_API_URL = process.env.VITE_PROXY_API_URL || ''
const VERSION_NUMBER_OF_APP = process.env.VITE_VERSION_NUMBER_OF_APP || ''
const NAME_OF_APP = process.env.VITE_NAME_OF_APP || ''

const getOptions = ({
  token,
  infoOfSystem,
  selectedShopChannel,
}: {
  token: string
  infoOfSystem: IUserInfo
  selectedShopChannel?: IMappedChannel
}) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(selectedShopChannel &&
      selectedShopChannel.eTrustedAccountRef && {
        'TrustedShops-Channel': selectedShopChannel.eTrustedChannelRef,
      }),
    ...(selectedShopChannel &&
      selectedShopChannel.eTrustedChannelRef && {
        'TrustedShops-Account': selectedShopChannel.eTrustedAccountRef,
      }),
  },
  params: {
    'Trustedshops-ConnectorModule': NAME_OF_APP,
    'Trustedshops-ConnectorModuleVersion': VERSION_NUMBER_OF_APP,
    'Trustedshops-ClientSystem': infoOfSystem.nameOfSystem || '',
    'Trustedshops-ClientSystemVersion': infoOfSystem.versionNumberOfSystem || '',
  },
})

const axiosInstance: AxiosInstance = axios.create({
  validateStatus: (status: number) => Math.trunc(status / 100) === 2,
})

const get = async <T>(
  apiUrl: string,
  path: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  const { data } = await axiosInstance.get(`${apiUrl}${path}`, {
    headers: {
      ...options.headers,
    },
    params: {
      ...options.params,
    },
  })
  return data
}

const post = async <T, N>(
  apiUrl: string,
  path: string,
  options: AxiosRequestConfig = {},
  body: N
): Promise<T> => {
  const { data } = await axiosInstance.post(`${apiUrl}${path}`, body, {
    headers: {
      ...options.headers,
    },
    params: {
      ...options.params,
    },
  })
  return data
}

const patch = async <T, N>(
  apiUrl: string,
  path: string,
  options: AxiosRequestConfig = {},
  body: N
): Promise<T> => {
  const { data } = await axiosInstance.patch(`${apiUrl}${path}`, body, {
    headers: {
      ...options.headers,
    },
    params: {
      ...options.params,
    },
  })
  return data
}

export const getChannelsFromTSC = async (
  infoOfSystem: IUserInfo,
  token: string
): Promise<Array<IChannelTS>> =>
  await get<Array<IChannelTS>>(PROXY_API_URL, '/channels', getOptions({ infoOfSystem, token }))
interface IWidgetsResponse {
  data: Array<IWidgetApi>
  paging: {
    cursors: {
      before: string
      after: string
    }
  }
}

export const getWidgets = async (
  refs: {
    accountRef: string
    channelRef: string
  },
  infoOfSystem: IUserInfo,
  token: string
): Promise<IWidgetsResponse> => {
  const options = getOptions({ infoOfSystem, token })
  return await get<IWidgetsResponse>(PROXY_API_URL || '', '/widgets', {
    params: {
      channelRef: refs.channelRef,
      ...options.params,
    },
    headers: options.headers,
  })
}

interface IETrustedId {
  accountRef: string
  changedAt: string
  channelRef: string
  createdAt: string
  tsId: string
}

export const getEtrustedID = async (
  selectedShopChannel: IMappedChannel,
  infoOfSystem: IUserInfo,
  token: string
): Promise<IETrustedId> => {
  return await get<IETrustedId>(
    PROXY_API_URL,
    `/mapping/etrusted-myts/${selectedShopChannel.eTrustedChannelRef}`,
    getOptions({ token, infoOfSystem, selectedShopChannel })
  )
}

export const getEtrustedIEventType = async (
  selectedShopChannel: IMappedChannel,
  infoOfSystem: IUserInfo,
  token: string
): Promise<EventType[]> => {
  return await get<EventType[]>(
    PROXY_API_URL,
    `/event-types`,
    getOptions({ selectedShopChannel, infoOfSystem, token })
  )
}

export const postEtrustedIEventType = async (
  selectedShopChannel: IMappedChannel,
  infoOfSystem: IUserInfo,
  token: string,
  body: {
    active: boolean
    name: string
  }
): Promise<EventType> => {
  return await post<EventType, { active: boolean; name: string }>(
    PROXY_API_URL,
    `/event-types`,
    getOptions({ selectedShopChannel, infoOfSystem, token }),
    body
  )
}

export const getEtrustedInviteSettings = async (
  selectedShopChannel: IMappedChannel,
  infoOfSystem: IUserInfo,
  token: string
): Promise<InviteSettingsByChannelType[]> => {
  const options = getOptions({ selectedShopChannel, infoOfSystem, token })

  return await get<InviteSettingsByChannelType[]>(PROXY_API_URL, `/invite-settings`, {
    params: {
      'channel-id': selectedShopChannel.eTrustedChannelRef,
      ...options.params,
    },
    headers: options.headers,
  })
}

export const patchInviteSettings = async (
  selectedShopChannel: IMappedChannel,
  infoOfSystem: IUserInfo,
  token: string,
  eventTypeId: string,
  body: InviteSettingsByChannelType
): Promise<InviteSettingsByChannelType[]> => {
  const options = getOptions({ selectedShopChannel, infoOfSystem, token })

  return await patch<InviteSettingsByChannelType[], InviteSettingsByChannelType>(
    PROXY_API_URL,
    `/invite-settings`,
    {
      params: {
        'event-type-id': eventTypeId,
        ...options.params,
      },
      headers: options.headers,
    },
    body
  )
}
export const patchInviteSettingsById = async (
  selectedShopChannel: IMappedChannel,
  infoOfSystem: IUserInfo,
  token: string,
  Id: string,
  body: InviteSettingsByChannelType
): Promise<InviteSettingsByChannelType[]> => {
  return await patch<InviteSettingsByChannelType[], InviteSettingsByChannelType>(
    PROXY_API_URL,
    `/invite-settings/${Id}`,
    getOptions({ selectedShopChannel, infoOfSystem, token }),
    body
  )
}
