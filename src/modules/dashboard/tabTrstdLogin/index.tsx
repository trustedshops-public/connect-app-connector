import { h } from 'preact'
import { FC, useState } from 'preact/compat'
import { TabProps } from '@/modules/type'
import { ScrinSpinner } from '@/components/layouts/spinner'
import useStore from '@/store/useStore'
import { selectorTrstdLogin, selectorChannels } from '@/store/selector'
import { MobileIcon } from '@/components/layouts/icons/MobileIcon'
import { DesktopIcon } from '@/components/layouts/icons/DesktopIcon'
import trstdLoginMobile from '@/assets/trstdlogin-mobile.svg'
import trstdLoginDesktop from '@/assets/trstdlogin-desktop.svg'

const TrstdLoginTab: FC<TabProps> = ({ phrasesByKey: _phrasesByKey }) => {
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
    <div className="ts-flex ts-flex-col ts-gap-6">
      {isLoadingBL && <ScrinSpinner />}

      {/* Header */}
      <div className="ts-pb-2">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          #trstd login
        </h2>
        <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280' }}>
          Adapt the #trstd login to your corporate design, register testing URLs, and generate integration snippets for manual placement.{' '}
          <a
            href="https://app.etrusted.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ts-font-normal"
            style={{ color: '#2563EB', textDecoration: 'underline' }}
          >
            Open Trusted Shops' Control Centre
          </a>
        </p>
      </div>

      {/* Card 1: Toggle */}
      <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-6 sm:ts-p-8" style={{ border: '1px solid #E5E7EB' }}>
        <div className="ts-flex ts-items-center ts-justify-between">
          <p className="ts-text-sm ts-font-normal ts-text-default">
            Display on this channel (with automatic placement)
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
            Automatic Placement
          </h3>
          <p className="ts-text-sm ts-font-normal ts-text-center ts-mb-6" style={{ color: '#6b7280', margin: '0 auto 24px' }}>
            Automatic placement positions the #trstd login prominently in your main header, near account and cart, the symbols of personal data and money.
            These are prime targets of fake sites. So, exactly the right place to prove your site's authenticity.
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
                Mobile
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
                Desktop
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
    </div>
  )
}

export default TrstdLoginTab
