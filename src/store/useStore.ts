import { create } from 'zustand'
import { ITbStore } from './trustbadge/types'
import { infoStore } from './info'
import { authStore } from './auth'
import { InfoStore } from './info/types'
import { IAuthStore } from './auth/types'
import { channelStore } from './channel'
import { widgetsStore } from './widgets'
import { IWidgetsStore } from './widgets/types'
import { IChannelStore } from './channel/types'
import { trustbadgeStore } from './trustbadge'
import { notificationStore } from './notification'
import { INotificationStore } from './notification/types'
import { reviewInvitesStore } from './reviewInvites'
import {
  IReviewInvitesStore,
  ReviewInvitesActionsStore,
  ReviewInvitesActionsStore_2,
} from './reviewInvites/types'
import { reviewInvitesActionsStore } from './reviewInvites/reviewInvitesSendActions'
import { reviewInvitesActionsStore_2 } from './reviewInvites/reviewInvitesSendActions_2'
export type AppStore = ITbStore &
  InfoStore &
  IAuthStore &
  IChannelStore &
  IWidgetsStore &
  INotificationStore &
  IReviewInvitesStore &
  ReviewInvitesActionsStore &
  ReviewInvitesActionsStore_2

const useStore = create<AppStore>((set, get) => ({
  ...authStore(set, get),
  ...infoStore(set, get),
  ...channelStore(set, get),
  ...widgetsStore(set, get),
  ...trustbadgeStore(set, get),
  ...notificationStore(set, get),
  ...reviewInvitesStore(set, get),
  ...reviewInvitesActionsStore(set, get),
  ...reviewInvitesActionsStore_2(set, get),
}))

export default useStore
