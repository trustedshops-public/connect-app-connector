/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetState, SetState } from 'zustand'
import { AppStore } from '../useStore'
import { AvilableOrderStatusesType, ReviewInvitesActionsStore_2 } from './types'

// const CHECKOUT_TYPE = 'checkout'
// const ORDER_SHIPPED_TYPE = 'order_shipped'

const defaultStatus = {
  name: 'Checkout',
  ID: 'Checkout', // You might want to use a unique ID here, like a string
  event_type: 'Checkout',
}

export const reviewInvitesActionsStore_2 = (
  set: SetState<AppStore>,
  get: GetState<AppStore>
): ReviewInvitesActionsStore_2 => ({
  setAvailableOrderStatuses: (value: AvilableOrderStatusesType[]) => {
    set(store => ({
      reviewInvitesState: {
        ...store.reviewInvitesState,
        availableOrderStatusesAction: [defaultStatus, ...value],
      },
    }))
  },
})
