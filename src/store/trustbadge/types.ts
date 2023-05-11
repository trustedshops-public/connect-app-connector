import { ITrustbadge, ITrustbadgeChildren } from '@/baseLayers/types'
import { IMappedChannel } from '../channel/types'

export interface ITrustbadgeState {
  isLoadingAPI: boolean
  isLoadingBL: boolean
  trustbadgeId: string
  errorNotification: {
    errorText: string
    status: string
  }
  trustbadgeDataChild: ITrustbadgeChildren
  initialTrustbadgeDataChild: ITrustbadgeChildren
}
export interface ITbStore {
  trustbadgeState: ITrustbadgeState
  setIsLoadingAPI: (value: boolean) => void
  setIsLoadingBL: (value: boolean) => void
  saveTrustbadgesAfterRemappingChannels: (channel: IMappedChannel) => void
  getTrustbadge: (selectedShopChannels: IMappedChannel) => void
  getTrustbadgeData: (data: ITrustbadge) => void
  updateTrustbadgeDataFromTextaria: (data: ITrustbadgeChildren) => void
  updateTrustbadgeData: (obj: {
    [key: string]: { value?: string | number | boolean; attributeName?: string }
  }) => void
  clearTrustbadgeData: () => void
  clearTrustbadgeState: () => void
}
