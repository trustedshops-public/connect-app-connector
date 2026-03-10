import { h } from 'preact'
import { FC } from 'preact/compat'
import { DASHBOARD_KEYS } from '@/locales/types'
import { IToastList } from '@/store/notification/types'
import useStore from '@/store/useStore'
import { ToastCloseIcon } from '@/components/layouts/icons/ToastCloseIcon'
import { ToastErrorIcon } from '@/components/layouts/icons/ToastErrorIcon'
import { ToastSuccessIcon } from '@/components/layouts/icons/ToastSuccessIcon'
import { selectorNotificationStore } from '@/store/selector'

export enum Statuses {
  error = 'error',
  success = 'success',
  cacheclear = 'cacheclear',
}

interface IProps<T> {
  list: Array<T>
  item: T
  deleteToast: (id: number) => void
  phrasesByKey: DASHBOARD_KEYS
}

const Toast: FC<IProps<IToastList>> = ({ item, deleteToast, phrasesByKey }) => {
  const isError = item.status === Statuses.error

  return (
    <div
      key={item.id}
      className="ts-relative ts-mt-4"
      style={{
        maxWidth: '420px',
        width: '100%',
        borderRadius: '12px',
        backgroundColor: isError ? '#FEF2F2' : '#F0FDF4',
        border: `1px solid ${isError ? '#FECACA' : '#BBF7D0'}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        padding: '16px 20px',
      }}
    >
      {/* Close X button - circle on top-left border edge */}
      <button
        onClick={() => {
          item.id && deleteToast(item.id)
        }}
        className="ts-border-0 ts-cursor-pointer ts-p-0 ts-flex ts-items-center ts-justify-center"
        style={{
          position: 'absolute',
          top: '-8px',
          left: '-8px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: isError ? '#FEE2E2' : '#DCFCE7',
          border: `1px solid ${isError ? '#FECACA' : '#BBF7D0'}`,
          color: isError ? '#DC2626' : '#16A34A',
          lineHeight: 0,
        }}
      >
        <ToastCloseIcon />
      </button>

      {/* Content row: icon aligned with title */}
      <div className="ts-flex ts-items-start ts-gap-3">
        {/* Status icon - aligned with the title line */}
        <div
          className="ts-flex ts-items-center ts-justify-center ts-flex-shrink-0"
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: isError ? '#DC2626' : '#16A34A',
          }}
        >
          {isError ? <ToastErrorIcon /> : <ToastSuccessIcon />}
        </div>

        {/* Text content */}
        <div className="ts-flex-1" style={{ paddingTop: '1px' }}>
          {item.errorText ? (
            <p className="ts-text-sm ts-font-bold" style={{ color: isError ? '#991B1B' : '#166534', lineHeight: '20px' }}>
              {item.errorText}
            </p>
          ) : (
            <p id="status_popup" className="ts-text-sm ts-font-bold" style={{ color: isError ? '#991B1B' : '#166534', lineHeight: '20px' }}>
              {phrasesByKey[`global_notification_${item.status}_${item.type}`]}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const ToastList: FC<{
  phrasesByKey: DASHBOARD_KEYS
}> = ({ phrasesByKey }) => {
  const { deleteToastItem } = useStore()
  const { toastList } = useStore(selectorNotificationStore)

  return (
    <div className="ts-fixed ts-z-[1202] ts-top-4 ts-left-4 ts-right-4 sm:ts-left-auto sm:ts-right-8">
      {toastList.map(item => (
        <Toast
          list={toastList}
          key={item}
          item={item}
          deleteToast={deleteToastItem}
          phrasesByKey={phrasesByKey}
        />
      ))}
    </div>
  )
}

export default ToastList
