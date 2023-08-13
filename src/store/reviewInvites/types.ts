import { IMappedChannel } from '@/baseLayers/types'

export type EventType = {
  id: string
  name: string
  active: boolean
  createdAt: string
  updateAt: string
}

export type Rules = {
  active?: boolean
  reatedAt: string
  default: boolean
  id: string
  name: string
  questionnaireTemplate?: {
    name: string
    id: string
  }
  sendingDelay: string
  template: { name: string; id: string }
  updatedAt: string
  timeOfDay?: string
}

export type InviteRule = {
  id: string
  name: string
  active: boolean
  rules: Rules[]
}

export interface InviteConfiguration {
  sendingDelayInDays?: number
  sendingTimeOfDay?: string
  inviteTemplateId?: string
  questionnaireTemplateId?: string
  enabled?: boolean
}

export interface InviteSettingsByChannelType {
  channelId?: string
  createdAt?: string
  eventTypeId?: string
  id?: string
  enabled?: boolean
  productInviteConfiguration?: InviteConfiguration
  serviceInviteConfiguration?: InviteConfiguration
}
export interface IReviewInvitesState {
  isLoading: boolean
  eventTypes: EventType[]
  inviteRules: InviteRule[]
  inviteSettingsByChannel: InviteSettingsByChannelType[]
  invitesForProducts: Nullable<IMappedChannel>
  numberOfDays: number
  initialDateToSendReviewInvites: {
    isEstimatedDeliveryDate: boolean
    isEventsByOrderStatusShipped: boolean
  }
  typesReviewInvites: {
    isEstimatedDeliveryDate: boolean
    isEventsByOrderStatusShipped: boolean
  }
  estimatedDeliveryAreLoadedFromBL: boolean
  orderStatusShippedAreLoadedFromBL: boolean
  eventTypesAreLoadedFromAPI: boolean
  isMappedTypesErorr: boolean
}

export type PayloadSendReview = {
  id: string
  isUseDateToSendReviewInvites?: boolean
  active?: boolean
}
export interface IReviewInvitesStore {
  reviewInvitesState: IReviewInvitesState
  setIsLoadingInvitesForProducts: (value: boolean) => void
  setInvitesForProducts: (value: Nullable<IMappedChannel>) => void
  changeNumberOfDays: (value: number) => void
  clearReviewInvitesState: () => void
  onExport: (id: string, salesChannelRef: string, includeProductData: boolean) => void
}
export interface ReviewInvitesActionsStore {
  getEventTypesFromApi: () => void
  getOrderStatus: () => void
  changeUseTimeOfSendReviewInvites: (value: { 
    isEstimatedDeliveryDate: boolean
    isEventsByOrderStatusShipped: boolean
  }) => void
  checkReviewEventTypes: () => void

  setUseEstimatedDeliveryDate: (estimatedDelivery: Nullable<PayloadSendReview>) => void
  setUseEventsByOrderStatusShipped: (orderStatusShipped: Nullable<PayloadSendReview>) => void
  saveChangeUseTimeOfSendReviewInvites: () => void
}
