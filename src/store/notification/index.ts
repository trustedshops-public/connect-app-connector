import { GetState, SetState } from 'zustand'
import { AppStore } from '../useStore'
import { INotificationState, INotificationStore, IToastList } from './types'

const initialState: INotificationState = {
  toastList: [],
}

// keep the toast stack short - when many actions run at once (e.g. saving
// several channels) the older toasts are dropped instead of piling up
const MAX_VISIBLE_TOASTS = 3
const SUCCESS_DISMISS_MS = 4000
const ERROR_DISMISS_MS = 6000

// sequential ids - Math.random ids collided and made deletes remove the wrong toast
let nextToastId = 1

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
    const currentList = get().notificationState.toastList

    // the user-visible text is derived from status/type (or errorText), so a
    // notification that would render identically to one already on screen is
    // skipped - e.g. one "saved" confirmation per channel when multiple
    // channels are processed in a row
    const isDuplicate = currentList.some(
      toast =>
        toast.status === item.status &&
        toast.type === item.type &&
        (toast.errorText || '') === (item.errorText || ''),
    )
    if (isDuplicate) return

    const toastItem = { ...item, id: nextToastId++ }
    set(store => ({
      notificationState: {
        ...store.notificationState,
        toastList: [...store.notificationState.toastList, toastItem].slice(-MAX_VISIBLE_TOASTS),
      },
    }))
    setTimeout(
      () => {
        get().deleteToastItem(toastItem.id)
      },
      item.status === 'error' ? ERROR_DISMISS_MS : SUCCESS_DISMISS_MS,
    )
  },
  deleteToastItem: (id: number) => {
    const toastList = get().notificationState.toastList
    const index = toastList.findIndex(e => e.id === id)
    if (index === -1) return
    toastList.splice(index, 1)

    set(store => ({
      notificationState: {
        ...store.notificationState,
        toastList: [...toastList],
      },
    }))
  },
})
