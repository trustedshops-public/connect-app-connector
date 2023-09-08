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

export type AvilableOrderStatusesType = { ID: string; name: string; event_type?: string }

export type PayloadUsedOrders = {
  eTrustedChannelRef: string
  salesChannelRef: string
  activeStatus: {
    product?: AvilableOrderStatusesType
    service?: AvilableOrderStatusesType
  }
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
  usedOrderStatusAreLoadedFromBL: boolean
  eventTypesAreLoadedFromAPI: boolean
  isMappedTypesErorr: boolean
  availableOrderStatusesAction: AvilableOrderStatusesType[]

  selectedReviews: { service?: AvilableOrderStatusesType; product?: AvilableOrderStatusesType }
  initialSelectedReviews?: {
    service?: AvilableOrderStatusesType
    product?: AvilableOrderStatusesType
  }
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
  onExport: (id: string, salesChannelRef: string) => void
  onExport_v2: (payload: {
    id: string
    salesChannelRef: string
    includeProductData: boolean
  }) => void
}
export interface ReviewInvitesActionsStore {
  getEventTypesFromApi: () => void
  changeUseTimeOfSendReviewInvites: (value: {
    isEstimatedDeliveryDate: boolean
    isEventsByOrderStatusShipped: boolean
  }) => void
  checkReviewEventTypes: () => void

  setUseEstimatedDeliveryDate: (estimatedDelivery: Nullable<PayloadSendReview>) => void
  setUseEventsByOrderStatusShipped: (orderStatusShipped: Nullable<PayloadSendReview>) => void
  saveChangeUseTimeOfSendReviewInvites: () => void
}

export interface ReviewInvitesActionsStore_2 {
  setAvailableOrderStatuses: (value: AvilableOrderStatusesType[]) => void
  getEventTypesFromApi_v2: () => void
  saveChangeUseTimeOfSendReviewInvites_v2: () => void
  setSelectedReviews: (val: { [key: string]: AvilableOrderStatusesType }) => void
  setUsedOrderStatuses: (val: PayloadUsedOrders) => void
}
