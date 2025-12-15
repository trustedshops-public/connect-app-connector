import { ComponentChildren, VNode, h, Fragment } from 'preact'
import { FC } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'
import BackgroundCard from '@/components/layouts/backgroundCard'

interface Props {
  children?: ComponentChildren
  showModal: boolean
  footerContent?: VNode
  onClose?: () => void
}

const Modal: FC<Props> = ({ children, showModal, footerContent, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showModal) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const first = focusableEls[0]
        const last = focusableEls[focusableEls.length - 1]

        if (!focusableEls.length) return

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showModal, onClose])

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
            className="ts-justify-center ts-items-center ts-flex ts-overflow-x-hidden ts-overflow-y-auto ts-fixed ts-inset-0 ts-z-50 ts-outline-none focus:ts-outline-none"
          >
            <div className="ts-relative ts-w-auto ts-my-6 ts-mx-auto">
              <BackgroundCard isActive>
                <div className="ts-relative ts-p-8 ts-flex-auto">{children}</div>
                <div className="ts-flex ts-items-center ts-justify-end ts-h-16 ts-p-4 ts-bg-gray-light-400 ts-rounded-b">
                  {footerContent}
                </div>
              </BackgroundCard>
            </div>
          </div>
          <div
            className="ts-opacity-50 ts-fixed ts-inset-0 ts-z-40 ts-bg-black"
            onClick={onClose}
            onKeyDown={onClose}
          />
        </Fragment>
      )}
    </Fragment>
  )
}

export default Modal
