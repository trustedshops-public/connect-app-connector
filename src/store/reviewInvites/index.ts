/* eslint-disable no-console */
import { IMappedChannel } from '@/baseLayers/types'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { SetState, GetState } from 'zustand'
import { AppStore } from '../useStore'
import { IReviewInvitesState, IReviewInvitesStore } from './types'

const initialState: IReviewInvitesState = {
  isLoading: false,
  invitesForProducts: null as Nullable<IMappedChannel>,
  numberOfDays: 0,
  initialDateToSendReviewInvites: {
    isEstimatedDeliveryDate: false,
    isEventsByOrderStatusShipped: false,
  },
  typesReviewInvites: {
    isEstimatedDeliveryDate: false,
    isEventsByOrderStatusShipped: false,
  },
  eventTypes: [],
  inviteRules: [],
  inviteSettingsByChannel: [],
  eventTypesAreLoadedFromAPI: false,
  estimatedDeliveryAreLoadedFromBL: false,
  orderStatusShippedAreLoadedFromBL: false,
  isMappedTypesErorr: false,
}

export const reviewInvitesStore = (
  set: SetState<AppStore>,
  get: GetState<AppStore>
): IReviewInvitesStore => ({
  reviewInvitesState: initialState,
  clearReviewInvitesState: () => {
    set(() => ({
      reviewInvitesState: {
        ...initialState,
      },
    }))
  },
  setIsLoadingInvitesForProducts: (value: boolean) => {
    set(store => ({ reviewInvitesState: { ...store.reviewInvitesState, isLoading: value } }))
  },
  setInvitesForProducts: (value: Nullable<IMappedChannel>) => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        invitesForProducts: value,
        isLoading: false,
      },
    }))
  },
  changeNumberOfDays: (value: number) => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        numberOfDays: value,
      },
    }))
  },
  onExport: (id: string, salesChannelRef: string, includeProductData: boolean) => {
    const numberOfDays = get().reviewInvitesState.numberOfDays
    dispatchAction({
      action: EVENTS.EXPORT_PREVIOUS_ORDER,
      payload: { id, numberOfDays, salesChannelRef,includeProductData },
    })
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        isLoading: true,
      },
    }))
  },
})
