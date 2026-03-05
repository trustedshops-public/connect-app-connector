import { h } from 'preact'
import { FC, useState } from 'preact/compat'
import { TabProps } from '@/modules/type'
import { ScrinSpinner } from '@/components/layouts/spinner'
import useStore from '@/store/useStore'
import { selectorTrstdLogin, selectorChannels } from '@/store/selector'
import { MobileIcon } from '@/components/layouts/icons/MobileIcon'
import { DesktopIcon } from '@/components/layouts/icons/DesktopIcon'

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

  console.log('trstdLoginData', trstdLoginData)

  return (
    <div className="ts-flex ts-flex-col ts-gap-6">
      {isLoadingBL && <ScrinSpinner />}

      {/* Header - centered text with link */}
      <div className="ts-text-center ts-pb-2">
        <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280' }}>
          Adapt the #trstd login to your corporate design, register testing URLs, and generate integration snippets
          <br />
          for manual placement.{' '}
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
            {previewTab === 'mobile' ? (
              <MobilePreview />
            ) : (
              <DesktopPreview />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const MobilePreview: FC = () => (
  <div
    className="ts-rounded-[12px] ts-overflow-hidden"
    style={{
      width: '280px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
    }}
  >
    {/* Browser chrome */}
    <div className="ts-flex ts-items-center ts-gap-2 ts-px-3 ts-py-2" style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>
      <div className="ts-flex ts-gap-1">
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
      </div>
      <div
        className="ts-flex-1 ts-text-center"
        style={{ fontSize: '10px', color: '#9CA3AF', backgroundColor: '#FFFFFF', borderRadius: '4px', padding: '2px 8px' }}
      >
        myshop.com
      </div>
    </div>

    {/* Header bar */}
    <div className="ts-flex ts-items-center ts-justify-between ts-px-4 ts-py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <div className="ts-flex ts-items-center ts-gap-2">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M1 1H15M1 6H15M1 11H15" stroke="#374151" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>MyShop</span>
      </div>
      <div className="ts-flex ts-items-center ts-gap-2">
        {/* trstd login toggle icon */}
        <div
          className="ts-flex ts-items-center ts-justify-center"
          style={{
            width: '28px',
            height: '18px',
            borderRadius: '9px',
            border: '1px solid #181C20',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#FFD200',
              position: 'absolute',
              right: '1px',
            }}
          >
            <div
              className="ts-flex ts-items-center ts-justify-center"
              style={{ width: '100%', height: '100%' }}
            >
              <svg width="7" height="9" viewBox="0 0 19 22" fill="#181C20">
                <path d="m16.24 14.98c-2.2 3.26-5.28 6.24-9.36 6.24-4.34 0-6.88-2.72-6.88-7.12 0-7.12 5.28-14.1 12.68-14.1 2.48-.02 5.84.98 5.84 4 0 5.4-8.46 7.2-12.62 8.28-.16.8-.26 1.74-.28 2.7 0 1.88 1 3.6 3.06 3.6 2.68 0 4.82-2.58 6.4-4.5zm-2.3-11.62c0-1.1-.62-1.96-1.76-1.96-3.44 0-5.22 6.7-5.88 9.32 3.2-.96 7.64-3.58 7.64-7.36z" />
              </svg>
            </div>
          </div>
        </div>
        {/* Cart icon */}
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M6 6h12l-1.5 7H7.5L6 6z" stroke="#374151" stroke-width="1.2" fill="none" />
          <circle cx="8.5" cy="17" r="1" fill="#374151" />
          <circle cx="15.5" cy="17" r="1" fill="#374151" />
        </svg>
      </div>
    </div>

    {/* Content placeholder */}
    <div className="ts-px-6 ts-py-6 ts-flex ts-flex-col ts-gap-3">
      <div style={{ height: '10px', width: '60%', backgroundColor: '#E5E7EB', borderRadius: '4px', margin: '0 auto' }} />
      <div style={{ height: '8px', width: '80%', backgroundColor: '#E5E7EB', borderRadius: '4px', margin: '0 auto' }} />
      <div style={{ height: '8px', width: '70%', backgroundColor: '#DBEAFE', borderRadius: '4px', margin: '0 auto' }} />
    </div>

    {/* Buttons placeholder */}
    <div className="ts-flex ts-gap-3 ts-px-6 ts-pb-6">
      <div style={{ height: '32px', flex: 1, backgroundColor: '#374151', borderRadius: '6px' }} />
      <div style={{ height: '32px', flex: 1, backgroundColor: '#E5E7EB', borderRadius: '6px' }} />
    </div>
  </div>
)

const DesktopPreview: FC = () => (
  <div
    className="ts-rounded-[12px] ts-overflow-hidden"
    style={{
      width: '400px',
      maxWidth: '100%',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
    }}
  >
    {/* Browser chrome */}
    <div className="ts-flex ts-items-center ts-gap-2 ts-px-3 ts-py-2" style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>
      <div className="ts-flex ts-gap-1">
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
      </div>
      <div
        className="ts-flex-1 ts-text-center"
        style={{ fontSize: '10px', color: '#9CA3AF', backgroundColor: '#FFFFFF', borderRadius: '4px', padding: '2px 8px' }}
      >
        myshop.com
      </div>
    </div>

    {/* Header bar */}
    <div className="ts-flex ts-items-center ts-justify-between ts-px-6 ts-py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>MyShop</span>
      <div className="ts-flex ts-items-center ts-gap-4">
        <span style={{ fontSize: '11px', color: '#6B7280' }}>Products</span>
        <span style={{ fontSize: '11px', color: '#6B7280' }}>About</span>
        {/* trstd login toggle */}
        <div
          className="ts-flex ts-items-center ts-justify-center"
          style={{
            width: '28px',
            height: '18px',
            borderRadius: '9px',
            border: '1px solid #181C20',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#FFD200',
              position: 'absolute',
              right: '1px',
            }}
          >
            <div
              className="ts-flex ts-items-center ts-justify-center"
              style={{ width: '100%', height: '100%' }}
            >
              <svg width="7" height="9" viewBox="0 0 19 22" fill="#181C20">
                <path d="m16.24 14.98c-2.2 3.26-5.28 6.24-9.36 6.24-4.34 0-6.88-2.72-6.88-7.12 0-7.12 5.28-14.1 12.68-14.1 2.48-.02 5.84.98 5.84 4 0 5.4-8.46 7.2-12.62 8.28-.16.8-.26 1.74-.28 2.7 0 1.88 1 3.6 3.06 3.6 2.68 0 4.82-2.58 6.4-4.5zm-2.3-11.62c0-1.1-.62-1.96-1.76-1.96-3.44 0-5.22 6.7-5.88 9.32 3.2-.96 7.64-3.58 7.64-7.36z" />
                </svg>
            </div>
          </div>
        </div>
        {/* Account & Cart */}
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3" stroke="#374151" stroke-width="1.2" fill="none" />
          <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#374151" stroke-width="1.2" fill="none" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M6 6h12l-1.5 7H7.5L6 6z" stroke="#374151" stroke-width="1.2" fill="none" />
          <circle cx="8.5" cy="17" r="1" fill="#374151" />
          <circle cx="15.5" cy="17" r="1" fill="#374151" />
        </svg>
      </div>
    </div>

    {/* Content placeholder */}
    <div className="ts-px-8 ts-py-6 ts-flex ts-flex-col ts-gap-3">
      <div style={{ height: '12px', width: '40%', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
      <div style={{ height: '8px', width: '90%', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
      <div style={{ height: '8px', width: '75%', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
      <div style={{ height: '8px', width: '60%', backgroundColor: '#DBEAFE', borderRadius: '4px' }} />
    </div>

    {/* Buttons placeholder */}
    <div className="ts-flex ts-gap-3 ts-px-8 ts-pb-6">
      <div style={{ height: '32px', width: '120px', backgroundColor: '#374151', borderRadius: '6px' }} />
      <div style={{ height: '32px', width: '120px', backgroundColor: '#E5E7EB', borderRadius: '6px' }} />
    </div>
  </div>
)

export default TrstdLoginTab
