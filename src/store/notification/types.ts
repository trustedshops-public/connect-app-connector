export interface IToastList {
  event?: string
  text?: string
  id?: number
  status: string
  errorText?: string
  type?: string
}

export interface INotificationState {
  toastList: Array<IToastList>
}

export interface INotificationStore {
  notificationState: INotificationState
  addInToastList: (item: {
    event?: string
    text?: string
    status: string
    errorText?: string
    type?: string
  }) => void
  deleteToastItem: (id: number) => void
  clearNotificationState: () => void
}
