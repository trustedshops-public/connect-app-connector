import { InfoState } from './info/types'
import { IAuthState } from './auth/types'
import { IChannelState } from './channel/types'
import { ITrustbadgeState } from './trustbadge/types'
import { INotificationState } from './notification/types'
import { IReviewInvitesState } from './reviewInvites/types'
import { AppStore } from '@/store/useStore'

export const selectState = <T>(store: { state: T }): T => store.state
export const selectorTrustbadgeState = (store: {
  trustbadgeState: ITrustbadgeState
}): ITrustbadgeState => store.trustbadgeState

export const selectorChannels = (store: { channelState: IChannelState }): IChannelState =>
  store.channelState

export const selectorAuth = (store: { auth: IAuthState }): IAuthState => store.auth

export const selectorInfoOfSystem = (store: { infoState: InfoState }): InfoState => store.infoState

export const selectorReviewInvites = (store: {
  reviewInvitesState: IReviewInvitesState
}): IReviewInvitesState => store.reviewInvitesState
export const selectorNotificationStore = (store: {
  notificationState: INotificationState
}): INotificationState => store.notificationState

export const selectAllState = (store: AppStore) => {
  /* eslint-disable*/
  const { auth, ...restTrustbadgeState } = store.trustbadgeState as any

  return {
    infoState: store.infoState,
    channelState: store.channelState,
    trustbadgeState: restTrustbadgeState,
    notificationState: store.notificationState,
    reviewInvitesState: store.reviewInvitesState,
    widgetState: store.widgetState,
  }
}
