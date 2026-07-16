import { h } from 'preact'
import { FC } from 'preact/compat'
import { selectorStructuredMarkup } from '@/store/selector'
import { DASHBOARD_KEYS } from '@/locales/types'
import useStore from '@/store/useStore'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  isTrustbadgeDisabled: boolean
}

const StructuredMarkupSection: FC<Props> = ({ phrasesByKey, isTrustbadgeDisabled }) => {
  const { updateStructuredMarkupEnabled } = useStore()
  const { structuredMarkupEnabled, isLoadingStructuredMarkup } = useStore(
    selectorStructuredMarkup,
  )

  const isSwitchBlocked =
    isLoadingStructuredMarkup || (isTrustbadgeDisabled && !structuredMarkupEnabled)

  const handleSwitch = () => {
    if (isSwitchBlocked) return
    updateStructuredMarkupEnabled(!structuredMarkupEnabled)
  }

  return (
    <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-6">
      <h2 className="ts-text-default ts-font-bold ts-mb-1" style={{ fontSize: '16px' }}>
        {phrasesByKey.application_trustbadge_structuredMarkup_title ||
          'Structured data markup'}
      </h2>
      <p className="ts-text-sm ts-font-normal ts-mb-6" style={{ color: '#6b7280' }}>
        {phrasesByKey.application_trustbadge_structuredMarkup_description ||
          'Adds structured data markup (JSON-LD) with your Trusted Shops ratings to your shop pages. It is inserted into the head of your shop website and helps search engines display your star rating in search results.'}
      </p>

      <div style={{ borderBottom: '1px solid #E5E7EB', margin: '20px 0' }} />

      <div className="ts-flex ts-items-center ts-justify-between">
        <span className="ts-text-sm ts-font-normal ts-text-default">
          {phrasesByKey.application_trustbadge_structuredMarkup_toggle_label ||
            'Enable structured data markup'}
        </span>
        <button
          id="switch_button_structuredMarkup"
          type="button"
          onClick={handleSwitch}
          className="ts-border-0 ts-p-0 ts-cursor-pointer ts-flex-shrink-0"
          style={{
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: structuredMarkupEnabled ? '#16A34A' : '#D1D5DB',
            position: 'relative',
            transition: 'background-color 0.2s ease',
            opacity: isSwitchBlocked ? 0.25 : 1,
            cursor: isSwitchBlocked ? 'not-allowed' : 'pointer',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              position: 'absolute',
              top: '2px',
              left: structuredMarkupEnabled ? '22px' : '2px',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
          />
        </button>
      </div>

    </div>
  )
}

export default StructuredMarkupSection
