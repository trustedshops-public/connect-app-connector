import { h } from 'preact'
import { FC, useEffect, useState } from 'preact/compat'
import { TabProps } from '@/modules/type'
import { ITrstdLoginCustomization } from '@/store/trstdLogin/types'
import { ScrinSpinner } from '@/components/layouts/spinner'
import useStore from '@/store/useStore'
import { selectorTrstdLogin, selectorChannels, selectorInfoOfSystem } from '@/store/selector'
import { MobileIcon } from '@/components/layouts/icons/MobileIcon'
import { DesktopIcon } from '@/components/layouts/icons/DesktopIcon'
import { HelpCircleIcon } from '@/components/layouts/icons/HelpCircleIcon'
import { InfoCircleOutlinedIcon } from '@/components/layouts/icons/InfoCircleOutlinedIcon'
import trstdLoginMobile from '@/assets/trstdlogin-mobile.svg'
import trstdLoginDesktop from '@/assets/trstdlogin-desktop.svg'
import { ChevronRightSmallIcon } from '@/components/layouts/icons/ChevronRightSmallIcon'
import { Option, Select } from '@/components/controls/dropdown'
import StyledButton from '@/components/controls/styledButton'
import ApproveDisableModal from './approveDisableModal'

const TrstdLoginTab: FC<TabProps> = ({ phrasesByKey }) => {
  const [previewTab, setPreviewTab] = useState<'mobile' | 'desktop'>('mobile')
  const [showModal, setShowModal] = useState(false)

  const { updateTrstdLoginEnabled, saveTrstdLoginCustomization } = useStore()
  const { trstdLoginData, isLoadingBL } = useStore(selectorTrstdLogin)
  const { selectedShopChannels } = useStore(selectorChannels)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  const config = trstdLoginData.configuration
  const isEnabled = config?.integration?.trstdLoginEnabled ?? false

  const shopSystemName = infoOfSystem?.nameOfSystem ?? ''
  const capitalizedShopName = shopSystemName.charAt(0).toUpperCase() + shopSystemName.slice(1)
  // Shopify gets the global app-embed activation banner (with deep link) on dashboard
  // level instead; the tab-local hint remains for shop systems without a deep link.
  const showActionRequired = isEnabled && shopSystemName.toLowerCase() === 'shoper'
  const showCustomPlacement =
    isEnabled && (infoOfSystem?.allowsSupportTrstdLoginCustomization ?? false)

  const [customization, setCustomization] = useState<ITrstdLoginCustomization>({})

  // Prefill from the loaded configuration (arrives async via the base layer).
  useEffect(() => {
    setCustomization(trstdLoginData.customization ?? {})
  }, [trstdLoginData.customization])

  const setCustomizationField = (field: keyof ITrstdLoginCustomization) => (value: string) => {
    setCustomization(current => ({ ...current, [field]: value }))
  }

  const handleSaveCustomization = () => {
    saveTrstdLoginCustomization({
      target_selector: customization.target_selector?.trim() ?? '',
      position_desktop: customization.position_desktop || 'left',
      target_selector_mobile: customization.target_selector_mobile?.trim() ?? '',
      position_mobile: customization.position_mobile || 'left',
    })
  }

  const inputClass =
    'ts-text-sm ts-text-default ts-bg-white ts-border ts-border-solid ts-border-gray-100 hover:ts-border-gray-200 ts-rounded-[8px] ts-h-[36px] ts-px-3 focus:ts-outline-none focus:ts-ring-2 focus:ts-ring-blue-800 focus:ts-border-transparent'

  const positionPhrase: { [key: string]: string } = {
    left: phrasesByKey?.application_trstd_login_custom_placement_position_before ?? '',
    right: phrasesByKey?.application_trstd_login_custom_placement_position_after ?? '',
  }

  const renderPositionSelect = (field: 'position_desktop' | 'position_mobile') => (
    <Select
      testId={`trstdLogin_${field}`}
      id={`trstdLogin_${field}`}
      defaultValue={positionPhrase[customization[field] ?? 'left']}
    >
      {Object.keys(positionPhrase).map(value => (
        <Option
          testId={`trstdLogin_${field}_${value}`}
          id={`trstdLogin_${field}_${value}`}
          key={value}
          value={value}
          selected={(customization[field] ?? 'left') === value}
          changeSelectedOption={selected => setCustomizationField(field)(selected.toString())}
        >
          <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm">
            {positionPhrase[value]}
          </p>
        </Option>
      ))}
    </Select>
  )

  const handleToggle = () => {
    if (isEnabled) {
      setShowModal(true)
      return
    }
    updateTrstdLoginEnabled(true)
  }

  const handleDeactivate = () => {
    updateTrstdLoginEnabled(false)
    setShowModal(false)
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
        <div
          className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-6 sm:ts-p-8"
          style={{ border: '1px solid #E5E7EB' }}
        >
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

          {showActionRequired && (
            <div
              className="ts-flex ts-items-center ts-gap-3 ts-rounded-lg ts-p-4 ts-mt-5"
              style={{ backgroundColor: '#FEF3C6', border: '1px solid #DBD0A1' }}
            >
              <InfoCircleOutlinedIcon size={16} customClass="ts-flex-shrink-0 ts-text-[#973C00]" />
              <p
                className="ts-text-sm ts-font-normal"
                style={{ color: '#973C00' }}
                dangerouslySetInnerHTML={{
                  __html: (shopSystemName.toLowerCase() === 'shoper'
                    ? phrasesByKey.application_trstd_login_action_required_shoper
                    : phrasesByKey.application_trstd_login_action_required
                  ).replace('{{shopSystemName}}', capitalizedShopName),
                }}
              />
            </div>
          )}

          {/* Divider */}
          <div
            className="ts-w-full ts-my-5"
            style={{ height: '1px', backgroundColor: '#E5E7EB' }}
          />

          {/* Automatic Placement section */}
          <div className="ts-p-6 sm:ts-p-8">
            <p
              className="ts-text-sm ts-font-normal ts-text-center ts-mb-6 ts-max-w-[780px] ts-mx-auto"
              style={{ color: '#6b7280', margin: '0 auto 24px' }}
            >
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

        {/* Card: Custom placement (only when the base layer supports app-side placement, e.g. Shopify) */}
        {showCustomPlacement && (
          <div
            className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-6 sm:ts-p-8"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <p className="ts-text-default ts-text-sm ts-font-bold ts-mb-1">
              {phrasesByKey.application_trstd_login_custom_placement_title}
            </p>
            <p className="ts-text-sm ts-font-normal ts-mb-5" style={{ color: '#6b7280' }}>
              {phrasesByKey.application_trstd_login_custom_placement_description}
            </p>

            <div className="ts-grid ts-gap-4 sm:ts-gap-x-6 sm:ts-grid-cols-2">
              <div className="ts-flex ts-flex-col ts-gap-1">
                <label className="ts-text-sm ts-text-default">
                  {phrasesByKey.application_trstd_login_custom_placement_desktop_label}
                </label>
                <input
                  id="input_trstdLogin_selector_desktop"
                  data-testid="input_trstdLogin_selector_desktop"
                  type="text"
                  value={customization.target_selector ?? ''}
                  placeholder={
                    phrasesByKey.application_trstd_login_custom_placement_desktop_placeholder
                  }
                  onChange={(e): void =>
                    setCustomizationField('target_selector')((e.target as HTMLInputElement).value)
                  }
                  className={inputClass}
                />
              </div>
              <div className="ts-flex ts-flex-col ts-gap-1">
                <label className="ts-text-sm ts-text-default">
                  {phrasesByKey.application_trstd_login_custom_placement_position_label}
                </label>
                {renderPositionSelect('position_desktop')}
              </div>
              <div className="ts-flex ts-flex-col ts-gap-1">
                <label className="ts-text-sm ts-text-default">
                  {phrasesByKey.application_trstd_login_custom_placement_mobile_label}
                </label>
                <input
                  id="input_trstdLogin_selector_mobile"
                  data-testid="input_trstdLogin_selector_mobile"
                  type="text"
                  value={customization.target_selector_mobile ?? ''}
                  placeholder={
                    phrasesByKey.application_trstd_login_custom_placement_mobile_placeholder
                  }
                  onChange={(e): void =>
                    setCustomizationField('target_selector_mobile')(
                      (e.target as HTMLInputElement).value,
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div className="ts-flex ts-flex-col ts-gap-1">
                <label className="ts-text-sm ts-text-default">
                  {phrasesByKey.application_trstd_login_custom_placement_position_label}
                </label>
                {renderPositionSelect('position_mobile')}
              </div>
            </div>

            <div className="ts-flex ts-justify-end ts-mt-6">
              <StyledButton
                id="trstdLogin_save_customization"
                variant="primary"
                height={40}
                onClick={handleSaveCustomization}
              >
                {phrasesByKey.application_trstd_login_custom_placement_save}
              </StyledButton>
            </div>
          </div>
        )}

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
        <ApproveDisableModal
          phrasesByKey={phrasesByKey}
          showModal={showModal}
          handleCancel={() => setShowModal(false)}
          handleDeactivate={handleDeactivate}
        />
      </div>
    )
  )
}

export default TrstdLoginTab
