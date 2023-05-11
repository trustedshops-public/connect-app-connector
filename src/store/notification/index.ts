import { GetState, SetState } from 'zustand'
import { AppStore } from '../useStore'
import { INotificationState, INotificationStore, IToastList } from './types'

const initialState: INotificationState = {
  toastList: [],
}

export const notificationStore = (
  set: SetState<AppStore>,
  get: GetState<AppStore>
): INotificationStore => ({
  notificationState: initialState,
  clearNotificationState: () => {
    set(() => ({
      notificationState: {
        ...initialState,
      },
    }))
  },
  addInToastList: (item: IToastList) => {
    const toastItem = { ...item, id: Math.floor(Math.random() * 100 + 1) }
    set(store => ({
      notificationState: {
        ...store.notificationState,
        toastList: [...store.notificationState.toastList, toastItem],
      },
    }))
    setTimeout(() => {
      get().deleteToastItem(toastItem.id)
    }, 4000)
  },
  deleteToastItem: (id: number) => {
    const toastList = get().notificationState.toastList
    const index = toastList.findIndex(e => e.id === id)
    toastList.splice(index, 1)

    set(store => ({
      notificationState: {
        ...store.notificationState,
        toastList: [...toastList],
      },
    }))
  },
})
