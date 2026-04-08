import { h, Fragment } from 'preact'
import { FC } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'
import { WarningTriangleIcon } from '@/components/layouts/icons'
import StyledButton from '@/components/controls/styledButton'
import { DASHBOARD_KEYS } from '@/locales/types'

interface Props {
  phrasesByKey: Nullable<DASHBOARD_KEYS>
  showModal: boolean
  handleCancel: () => void
  handleDeactivate: () => void
}

const ApproveDisableModal: FC<Props> = ({
  phrasesByKey,
  showModal,
  handleCancel,
  handleDeactivate,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showModal) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel()
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
                  borderRadius: '14px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div className="ts-p-6">
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
                      {phrasesByKey?.application_trstd_login_popup_title}
                    </h2>
                  </div>

                  <div className="ts-pt-5 ts-pb-6">
                    <p
                      className="ts-font-normal"
                      style={{ fontSize: '14px', lineHeight: '21px', color: '#4B5563', whiteSpace: 'pre-line' }}
                    >
                      {phrasesByKey?.application_trstd_login_popup_text}
                    </p>
                  </div>

                  <div className="ts-flex ts-flex-col-reverse sm:ts-flex-row ts-gap-3">
                    <StyledButton id="cancelDeactivateTrstdLogin" variant="outlined" flex1 onClick={handleCancel}>
                      {phrasesByKey?.global_button_cancel}
                    </StyledButton>
                    <StyledButton id="submitDeactivateTrstdLogin" variant="primary" flex1 onClick={handleDeactivate}>
                      {phrasesByKey?.application_trstd_login_popup_submit}
                    </StyledButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="ts-opacity-50 ts-fixed ts-inset-0 ts-z-40 ts-bg-black"
            onClick={handleCancel}
          />
        </Fragment>
      )}
    </Fragment>
  )
}

export default ApproveDisableModal
