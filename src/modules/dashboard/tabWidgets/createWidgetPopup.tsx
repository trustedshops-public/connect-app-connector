import { FC } from 'preact/compat'
import { h, Fragment } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { ExternalLinkIcon } from '@/components/layouts/icons'
import StyledButton from '@/components/controls/styledButton'
import { DASHBOARD_KEYS } from '@/locales/types'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  channelRef: string
  modalIsOpen: boolean
  setOpenModal: (value: boolean) => void
}

const CreateWidgetPopup: FC<Props> = ({ channelRef, phrasesByKey, setOpenModal, modalIsOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modalIsOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenModal(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [modalIsOpen])

  useEffect(() => {
    if (modalIsOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [modalIsOpen])

  const steps = phrasesByKey.application_widgets_popup_text
    ? phrasesByKey.application_widgets_popup_text.split('\n').filter(Boolean)
    : []

  return (
    <Fragment>
      {modalIsOpen && (
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
                  {/* Title */}
                  <h2
                    className="ts-text-default ts-font-bold ts-pb-5"
                    style={{ fontSize: '16px', lineHeight: '22px', borderBottom: '1px solid #E5E7EB' }}
                  >
                    {phrasesByKey.application_widgets_popup_title}
                  </h2>

                  {/* Steps list */}
                  <div className="ts-pt-5 ts-pb-6">
                    <ul className="ts-list-none ts-p-0 ts-m-0 ts-flex ts-flex-col ts-gap-3">
                      {steps.map((step, index) => (
                        <li key={index}>
                          <span style={{ fontSize: '14px', lineHeight: '20px', color: '#4B5563' }}>
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="ts-flex ts-flex-col-reverse sm:ts-flex-row ts-gap-3">
                    <StyledButton id="cancelCreateWidgetPopup" variant="outlined" flex1 onClick={() => setOpenModal(false)}>
                      {phrasesByKey.global_button_cancel}
                    </StyledButton>
                    <StyledButton
                      id="submitCreateWidgetPopup"
                      variant="primary"
                      flex1
                      onClick={() => {
                        window.open(
                          `${phrasesByKey.application_widgets_popup_submit_url_1}?channels=${channelRef}`
                        )
                        setOpenModal(false)
                      }}
                    >
                      {phrasesByKey.application_widgets_popup_submit_text}
                      <ExternalLinkIcon color="#FFFFFF" />
                    </StyledButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="ts-opacity-50 ts-fixed ts-inset-0 ts-z-40 ts-bg-black"
            onClick={() => setOpenModal(false)}
          />
        </Fragment>
      )}
    </Fragment>
  )
}

export default CreateWidgetPopup
