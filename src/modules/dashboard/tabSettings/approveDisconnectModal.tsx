import { h, Fragment } from 'preact'
import { FC } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'
import { WarningTriangleIcon } from '@/components/layouts/icons'
import StyledButton from '@/components/controls/styledButton'
import { DASHBOARD_KEYS } from '@/locales/types'

interface Props {
  phrasesByKey: Nullable<DASHBOARD_KEYS>
  showModal: boolean
  handleCancel: (value: boolean) => void
  onDisconnect: () => void
}

const ApproveDisconnectModal: FC<Props> = ({
  phrasesByKey,
  showModal,
  handleCancel,
  onDisconnect,
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
                  borderRadius: '14px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div className="ts-p-6">
                  {/* Header: icon + title + subtitle */}
                  <div className="ts-flex ts-items-start ts-gap-3 ts-pb-5" style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <div
                      className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center ts-rounded-full"
                      style={{ width: '36px', height: '36px', backgroundColor: '#FEE2E2' }}
                    >
                      <WarningTriangleIcon customClass="ts-w-5 ts-h-5 ts-text-red-600" />
                    </div>
                    <div>
                      <h2
                        className="ts-text-default ts-font-bold"
                        style={{ fontSize: '16px', lineHeight: '22px' }}
                      >
                        {phrasesByKey?.application_settings_popup_titel}
                      </h2>
                      <p
                        className="ts-font-normal ts-mt-1"
                        style={{ fontSize: '13px', lineHeight: '18px', color: '#6B7280' }}
                      >
                        {phrasesByKey?.application_settings_popup_description}
                      </p>
                    </div>
                  </div>

                  {/* Body: description + bullet list */}
                  <div className="ts-pt-5 ts-pb-6">
                    <div
                      className="ts-font-normal"
                      style={{ fontSize: '14px', lineHeight: '21px', color: '#4B5563' }}
                    >
                      {(phrasesByKey?.application_settings_popup_body ?? '')
                        .split('\n')
                        .filter(Boolean)
                        .map((line, i) =>
                          line.trim().startsWith('•') ? (
                            <p key={i} className="ts-m-0 ts-mb-2 ts-flex ts-items-center ts-gap-2">
                              <span
                                className="ts-flex-shrink-0"
                                style={{ color: '#EF4444' }}
                              >
                                •
                              </span>
                              <span>{line.trim().slice(1).trim()}</span>
                            </p>
                          ) : (
                            <p key={i} className="ts-m-0 ts-mb-4">
                              {line.trim()}
                            </p>
                          ),
                        )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="ts-flex ts-flex-col-reverse sm:ts-flex-row ts-gap-3">
                    <StyledButton id="cancelSettingsDisconnect" variant="outlined" flex1 onClick={() => handleCancel(false)}>
                      {phrasesByKey?.global_button_cancel}
                    </StyledButton>
                    <StyledButton id="settingsDisconnect" variant="danger" flex1 onClick={onDisconnect}>
                      {phrasesByKey?.application_settings_popup_submit}
                    </StyledButton>
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

export default ApproveDisconnectModal
