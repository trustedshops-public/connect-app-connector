import { h } from 'preact'
import { FC, useState } from 'preact/compat'
import { TabProps } from '@/modules/type'
import { ScrinSpinner } from '@/components/layouts/spinner'
import useStore from '@/store/useStore'
import { selectorTrstdLogin, selectorChannels } from '@/store/selector'
import { MobileIcon } from '@/components/layouts/icons/MobileIcon'
import { DesktopIcon } from '@/components/layouts/icons/DesktopIcon'
import { HelpCircleIcon } from '@/components/layouts/icons/HelpCircleIcon'
import trstdLoginMobile from '@/assets/trstdlogin-mobile.svg'
import trstdLoginDesktop from '@/assets/trstdlogin-desktop.svg'
import { ChevronRightSmallIcon } from '@/components/layouts/icons/ChevronRightSmallIcon'

const TrstdLoginTab: FC<TabProps> = ({ phrasesByKey }) => {
  const [previewTab, setPreviewTab] = useState<'mobile' | 'desktop'>('mobile')

  const { updateTrstdLoginEnabled } = useStore()
  const { trstdLoginData, isLoadingBL } = useStore(selectorTrstdLogin)
  const { selectedShopChannels } = useStore(selectorChannels)

  const config = trstdLoginData.configuration
  const isEnabled = config?.integration?.trstdLoginEnabled ?? false

  const handleToggle = () => {
    updateTrstdLoginEnabled(!isEnabled)
  }

  return (
    phrasesByKey && (
    <div className="ts-flex ts-flex-col ts-gap-6">
      {isLoadingBL && <ScrinSpinner />}

      {/* Header */}
      <div className="ts-pb-2">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          {phrasesByKey.application_trstd_login_header_title}
        </h2>
        <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280' }}>
            {phrasesByKey.application_trstd_login_header_description} 
        </p>
      </div>

      {/* Card 1: Toggle */}
      <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-6 sm:ts-p-8" style={{ border: '1px solid #E5E7EB' }}>
        <div className="ts-flex ts-items-center ts-justify-between">
          <p className="ts-text-sm ts-font-normal ts-text-default">
            {phrasesByKey.application_trstd_login_toggle_label}
          </p>
          <button
            id="switch_button_trstdLogin"
            type="button"
            onClick={handleToggle}
            disabled={!selectedShopChannels.eTrustedChannelRef}
            className="ts-border-0 ts-p-0 ts-cursor-pointer ts-flex-shrink-0"
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              backgroundColor: isEnabled ? '#16A34A' : '#D1D5DB',
              position: 'relative',
              transition: 'background-color 0.2s ease',
              opacity: !selectedShopChannels.eTrustedChannelRef ? 0.25 : 1,
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
                left: isEnabled ? '22px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }}
            />
          </button>
        </div>

        {/* Divider */}
        <div className="ts-w-full ts-my-5" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

        {/* Automatic Placement section */}
        <div
          className="ts-p-6 sm:ts-p-8"
        >
          <h3 className="ts-text-default ts-font-bold ts-text-center ts-mb-2" style={{ fontSize: '15px' }}>
            {phrasesByKey.application_trstd_login_automatic_placement_title}
          </h3>
          <p className="ts-text-sm ts-font-normal ts-text-center ts-mb-6 ts-max-w-[720px] ts-mx-auto" style={{ color: '#6b7280', margin: '0 auto 24px' }}>
            {phrasesByKey.application_trstd_login_automatic_placement_description}
          </p>

          {/* Mobile / Desktop tabs */}
          <div className="ts-flex ts-justify-center ts-mb-6">
            <div className="ts-flex ts-gap-6">
              <button
                type="button"
                onClick={() => setPreviewTab('mobile')}
                className="ts-flex ts-items-center ts-gap-2 ts-px-1 ts-pb-2 ts-text-sm ts-font-medium ts-bg-transparent ts-border-0 ts-border-b-2 ts-cursor-pointer"
                style={{
                  color: previewTab === 'mobile' ? '#155DFC' : '#6B7280',
                  borderBottomColor: previewTab === 'mobile' ? '#155DFC' : 'transparent',
                }}
              >
                <MobileIcon />
                {phrasesByKey.application_trstd_login_automatic_placement_mobile}
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('desktop')}
                className="ts-flex ts-items-center ts-gap-2 ts-px-1 ts-pb-2 ts-text-sm ts-font-medium ts-bg-transparent ts-border-0 ts-border-b-2 ts-cursor-pointer"
                style={{
                  color: previewTab === 'desktop' ? '#155DFC' : '#6B7280',
                  borderBottomColor: previewTab === 'desktop' ? '#155DFC' : 'transparent',
                }}
              >
                <DesktopIcon />
                {phrasesByKey.application_trstd_login_automatic_placement_desktop}
              </button>
            </div>
          </div>

          {/* Illustration */}
          <div className="ts-flex ts-justify-center">
            <img
              src={previewTab === 'mobile' ? trstdLoginMobile : trstdLoginDesktop}
              alt={`#trstd login ${previewTab} preview`}
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          </div>
        </div>
      </div>

      {/* Card 2: About the #trstd login */}
      <div
        className="ts-rounded-[14px] ts-shadow-md ts-p-4 sm:ts-p-6"
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
          border: '1px solid #E5E7EB',
        }}
      >
        <div className="ts-flex ts-items-start ts-gap-4">
          <div
            className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center ts-rounded-[12px]"
            style={{ width: '40px', height: '40px', backgroundColor: '#DBEAFE' }}
          >
            <HelpCircleIcon customClass="ts-text-blue-600" />
          </div>
          <div>
            <p className="ts-text-default ts-text-sm ts-font-bold ts-mb-1">
              {phrasesByKey.application_trstd_login_about_title}
            </p>
            <p className="ts-text-sm ts-font-normal ts-mb-3" style={{ color: '#6b7280' }}>
              {phrasesByKey.application_trstd_login_about_description}
            </p>
            <a
              href={phrasesByKey.application_trstd_login_about_learnMore_url}
              className="ts-text-sm ts-font-normal ts-inline-flex ts-items-center ts-gap-1"
              style={{ color: '#2563EB' }}
              target="_blank"
              rel="noreferrer"
            >
              {phrasesByKey.application_trstd_login_about_learnMore}
              <ChevronRightSmallIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
    )
  )
}

export default TrstdLoginTab
