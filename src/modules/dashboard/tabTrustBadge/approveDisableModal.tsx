import { h, Fragment } from 'preact'
import { FC } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'
import { WarningTriangleIcon } from '@/components/layouts/icons'
import { ITrustbadgeChildren } from '@/baseLayers/types'
import { DASHBOARD_KEYS } from '@/locales/types'

interface Props {
  phrasesByKey: Nullable<DASHBOARD_KEYS>
  showModal: boolean
  handleCancel: (value: boolean) => void
  diactivateTB: (data: Nullable<ITrustbadgeChildren>) => void
  data: Nullable<ITrustbadgeChildren>
}

const ApproveDisableModal: FC<Props> = ({
  phrasesByKey,
  showModal,
  handleCancel,
  diactivateTB,
  data,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showModal) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showModal])

  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus()
    }
  }, [showModal])

  return (
    <Fragment>
      {showModal && (
        <Fragment>
          <div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="ts-justify-center ts-items-center ts-flex ts-overflow-x-hidden ts-overflow-y-auto ts-fixed ts-inset-0 ts-z-50 ts-outline-none focus:ts-outline-none ts-font-sans"
          >
            <div
              className="ts-relative ts-w-full ts-mx-4 ts-my-4 sm:ts-mx-auto sm:ts-my-0"
              style={{ maxWidth: '480px' }}
            >
              <div
                className="ts-bg-white"
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div className="ts-p-6 sm:ts-p-8">
                  {/* Header: icon + title */}
                  <div className="ts-flex ts-items-start ts-gap-3 ts-pb-5" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <div
                      className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center ts-rounded-full"
                      style={{ width: '36px', height: '36px', backgroundColor: '#FEE2E2' }}
                    >
                      <WarningTriangleIcon customClass="ts-w-5 ts-h-5 ts-text-red-600" />
                    </div>
                    <h2
                      className="ts-text-default ts-font-bold"
                      style={{ fontSize: '16px', lineHeight: '22px' }}
                    >
                      {phrasesByKey?.application_trustbadge_popup_titel}
                    </h2>
                  </div>

                  {/* Body text */}
                  <div className="ts-pt-5 ts-pb-6">
                    <p
                      className="ts-font-normal"
                      style={{ fontSize: '14px', lineHeight: '21px', color: '#4B5563' }}
                    >
                      {phrasesByKey?.application_trustbadge_popup_text}
                    </p>
                    <p
                      className="ts-font-normal ts-mt-5"
                      style={{ fontSize: '14px', lineHeight: '21px', color: '#4B5563' }}
                    >
                      Are you sure you want to continue?
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="ts-flex ts-flex-col-reverse sm:ts-flex-row ts-gap-3">
                    <button
                      id="cancelDiactivateTB"
                      type="button"
                      onClick={() => handleCancel(false)}
                      className="ts-flex-1 ts-text-sm ts-font-bold ts-cursor-pointer"
                      style={{
                        height: '36px',
                        borderRadius: '4px',
                        border: '1px solid #D1D5DB',
                        background: 'linear-gradient(180deg, #F7F7F7 0%, #F5F5F5 9%, #E8E8E8 100%)',
                        color: '#005aa0',
                      }}
                    >
                      {phrasesByKey?.global_button_cancel}
                    </button>
                    <button
                      id="submitDiactivateTB"
                      type="button"
                      onClick={() => diactivateTB(data)}
                      className="ts-flex-1 ts-text-sm ts-font-bold ts-cursor-pointer"
                      style={{
                        height: '36px',
                        borderRadius: '4px',
                        border: '1px solid #9E262A',
                        background: 'linear-gradient(180deg, #F7F7F7 0%, #F5F5F5 9%, #E8E8E8 100%)',
                        color: '#B91C1C',
                      }}
                    >
                      {phrasesByKey?.application_trustbadge_popup_submit}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="ts-opacity-50 ts-fixed ts-inset-0 ts-z-40 ts-bg-black"
            onClick={() => handleCancel(false)}
          />
        </Fragment>
      )}
    </Fragment>
  )
}

export default ApproveDisableModal
