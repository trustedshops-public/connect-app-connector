import { h, Fragment } from 'preact'
import { FC, useState, useEffect } from 'preact/compat'
import { isEqual } from '@/utils'
// Radio selection is now handled inline with custom styled divs
import ApproveDisableModal from './approveDisableModal'
import { dispatchAction, EVENTS } from '@/eventsLib'
import {
  getParsedTrustbadgeDataStrToObj,
  getParsedTrustbadgeDataToString,
} from '@/modules/dashboard/tabTrustBadge/parseTrustbadgeData'
import { ScrinSpinner } from '@/components/layouts/spinner'
import {
  selectAllState,
  selectorAuth,
  selectorChannels,
  selectorInfoOfSystem,
  selectorTrustbadgeState,
} from '@/store/selector'
import { ITrustbadgeChildren } from '@/baseLayers/types'
import useStore from '@/store/useStore'
import EditIntegrationCodeProps from './editIntegrationCode'
import StandartEditor from './standartEditor'
import TrustBadgeSwitcher from './trustBadgeSwitcher'
import { TabProps } from '@/modules/type'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import trustbadgeDesktop from '@/assets/trustbadge-desktop.svg'
import trustbadgeMobile from '@/assets/trustbadge-mobile.svg'

const TrustBadgeTab: FC<TabProps> = ({ phrasesByKey }) => {
  const dataRadioButton = [
    { value: 'Standard integration', id: 'standard', desc: 'Automatically integrated via plugin. The Trustbadge will be displayed on all pages with default settings.' },
    { value: 'Edit integration code', id: 'expert', desc: 'Manually add the integration code to your theme for more control over placement and styling.' },
  ]
  const placementPhrase = {
    left: phrasesByKey.application_trustbadge_placement_left,
    right: phrasesByKey.application_trustbadge_placement_right,
    center: phrasesByKey.application_trustbadge_placement_center,
  }
  const [isDisabled, setIsDisabled] = useState(true)
  const [selectedOption, setSelectedOption] = useState(dataRadioButton[0].id)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [textStr, setTextStr] = useState<string>('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [trustbadgeDataCache, setTrustbadgeDataCache] =
    useState<Nullable<ITrustbadgeChildren>>(null)
  const [previewTab, setPreviewTab] = useState<'desktop' | 'mobile'>('desktop')

  const { updateTrustbadgeDataFromTextaria, updateTrustbadgeData, setIsLoadingBL } = useStore()
  const {
    trustbadgeId,
    trustbadgeDataChild,
    initialTrustbadgeDataChild,
    isLoadingAPI,
    isLoadingBL,
  } = useStore(selectorTrustbadgeState)
  const { user } = useStore(selectorAuth)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const { isLoadingSave, selectedShopChannels } = useStore(selectorChannels)
  const allState = useStore(selectAllState)

  useEffect(() => {
    if (!trustbadgeDataChild || !trustbadgeDataChild.attributes) return
    setIsDisabled(
      trustbadgeDataChild.attributes && trustbadgeDataChild.attributes['data-disable-trustbadge']
        ? (trustbadgeDataChild.attributes['data-disable-trustbadge'].value as boolean)
        : true,
    )
    const dataStr = getParsedTrustbadgeDataToString(trustbadgeDataChild)
    setTextStr(dataStr)

    const isEqualRB = isEqual(trustbadgeDataChild, initialTrustbadgeDataChild)
    setIsButtonDisabled(isEqualRB)
  }, [trustbadgeDataChild])

  const onChangeScript = (str: string) => {
    const parsedData = getParsedTrustbadgeDataStrToObj(str)

    if (parsedData.attributes['data-disable-trustbadge'].value) {
      setTrustbadgeDataCache(parsedData)
      setShowModal(true)
      return
    }
    updateTrustbadgeDataFromTextaria(parsedData)
  }

  const handleSwitch = () => {
    if (!isDisabled) {
      setShowModal(true)
      return
    }
    updateTrustbadgeData({
      'data-disable-trustbadge': {
        value: !isDisabled,
        attributeName: 'data-disable-trustbadge',
      },
    })
  }

  const diactivateTB = (data: Nullable<ITrustbadgeChildren>): void => {
    setIsLoadingBL(true)
    dispatchAction({
      action: EVENTS.SAVE_TRUSTBADGE_CONFIGURATION,
      payload: {
        id: trustbadgeId,
        eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
        salesChannelRef: selectedShopChannels.salesChannelRef,
        children: [
          data || {
            tag: trustbadgeDataChild.tag,
            attributes: {
              ...trustbadgeDataChild.attributes,
              'data-disable-trustbadge': {
                value: true,
                attributeName: 'data-disable-trustbadge',
              },
            },
          },
        ],
      },
    })
    setTrustbadgeDataCache(null)
    setShowModal(false)
  }

  const handleCancel = (value: boolean): void => {
    trustbadgeDataCache &&
      updateTrustbadgeDataFromTextaria({
        tag: trustbadgeDataCache.tag,
        attributes: {
          ...trustbadgeDataCache.attributes,
          'data-disable-trustbadge': {
            value: false,
            attributeName: 'data-disable-trustbadge',
          },
        },
      })
    setShowModal(value)
  }

  const saveDataTrustbadge = () => {
    setIsLoadingBL(true)
    const payload = {
      id: trustbadgeId,
      eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
      children: [trustbadgeDataChild],
      salesChannelRef: selectedShopChannels.salesChannelRef,
    }
    dispatchAction({
      action: EVENTS.SAVE_TRUSTBADGE_CONFIGURATION,
      payload,
    })
    handleEtrustedConfiguration(
      user?.access_token,
      allState,
      'trustbadge',
      putEtrustedConfiguration,
    )
  }

  return (
    phrasesByKey && (
      <div className="ts-flex ts-flex-col ts-gap-6">
        {(isLoadingAPI || isLoadingBL || isLoadingSave) && <ScrinSpinner />}

        {/* Card 1: Trustbadge header + toggle */}
        <TrustBadgeSwitcher handleSwitch={handleSwitch} phrasesByKey={phrasesByKey} />

        {/* Card 2: Placement & Visibility */}
        <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-8">
          <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
            Placement & Visibility
          </h2>
          <p className="ts-text-sm ts-font-normal ts-mb-6" style={{ color: '#6b7280' }}>
            The Trustbadge is automatically placed on your shop and adapts seamlessly to both desktop and mobile layouts, building customer trust at every touchpoint.
          </p>

          {/* Desktop / Mobile toggle */}
          <div className="ts-flex ts-justify-center ts-mb-6">
            <div
              className="ts-flex ts-rounded-full ts-p-1"
              style={{ border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}
            >
              <button
                type="button"
                onClick={() => setPreviewTab('desktop')}
                className={`ts-flex ts-items-center ts-gap-2 ts-px-5 ts-py-2 ts-text-sm ts-font-normal ts-rounded-full ts-border-0 ts-cursor-pointer ${
                  previewTab === 'desktop' ? 'ts-bg-white ts-shadow-sm' : 'ts-bg-transparent'
                }`}
                style={{ color: previewTab === 'desktop' ? '#111827' : '#6B7280' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="2" width="13" height="9" rx="1" stroke="currentColor" stroke-width="1.2" fill="none" />
                  <path d="M5.5 14H10.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                  <path d="M8 11V14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('mobile')}
                className={`ts-flex ts-items-center ts-gap-2 ts-px-5 ts-py-2 ts-text-sm ts-font-normal ts-rounded-full ts-border-0 ts-cursor-pointer ${
                  previewTab === 'mobile' ? 'ts-bg-white ts-shadow-sm' : 'ts-bg-transparent'
                }`}
                style={{ color: previewTab === 'mobile' ? '#111827' : '#6B7280' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="3.5" y="1.5" width="9" height="13" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none" />
                  <path d="M6.5 12.5H9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
                Mobile
              </button>
            </div>
          </div>

          {/* Placement description */}
          <div className="ts-text-center ts-mb-6">
            <p className="ts-text-sm ts-font-bold ts-text-default ts-mb-1">
              {previewTab === 'desktop' ? 'Desktop placement' : 'Mobile placement'}
            </p>
            <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280' }}>
              {previewTab === 'desktop'
                ? 'Displayed as a fixed badge in the bottom-right corner, always visible as customers browse your shop.'
                : 'Adapts intelligently: appears as a compact badge on mobile devices, optimized for touch interaction.'}
            </p>
          </div>

          {/* Illustration */}
          <div className="ts-flex ts-justify-center">
            <img
              src={previewTab === 'desktop' ? trustbadgeDesktop : trustbadgeMobile}
              alt={`Trustbadge ${previewTab} preview`}
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          </div>
        </div>

        {/* Card 3: Choose your integration settings */}
        {infoOfSystem.allowsEditIntegrationCode && (
          <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-8">
            <h2 className={`ts-text-default ts-text-sm ts-font-bold ts-mb-1 ${isDisabled && 'ts-opacity-25'}`}>
              Choose your integration settings
            </h2>
            <p className={`ts-text-sm ts-font-normal ts-mb-6 ${isDisabled && 'ts-opacity-25'}`} style={{ color: '#6b7280' }}>
              Select how you want to integrate the Trustbadge into your shop.
            </p>

            <div className="ts-flex ts-flex-col ts-gap-3">
              {dataRadioButton.map(({ value, id, desc }) => {
                const isSelected = selectedOption === id && !isDisabled
                return (
                  <div
                    key={id}
                    className={`ts-cursor-pointer ${isDisabled ? 'ts-opacity-50 ts-cursor-not-allowed' : ''}`}
                    style={{
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #155DFC' : '1px solid #E5E7EB',
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      padding: isSelected ? '15px 19px' : '16px 20px',
                    }}
                    onClick={() => {
                      if (isDisabled) return
                      setSelectedOption(id)
                    }}
                  >
                    <div className="ts-flex ts-items-center ts-gap-3">
                      {/* Radio circle */}
                      <div
                        className="ts-flex ts-items-center ts-justify-center ts-flex-shrink-0"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #155DFC' : '2px solid #D1D5DB',
                          backgroundColor: isSelected ? '#155DFC' : '#FFFFFF',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        )}
                      </div>
                      {/* Text */}
                      <div>
                        <p className="ts-text-sm ts-font-bold ts-text-default">
                          {value}
                          {id === 'expert' && (
                            <span className="ts-ml-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'inline', verticalAlign: 'middle' }}>
                                <path d="M4 1L2 3.5V10.5C2 10.7761 2.22386 11 2.5 11H9.5C9.77614 11 10 10.7761 10 10.5V3.5L8 1H4Z" stroke="#6B7280" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                                <path d="M2 3.5H10" stroke="#6B7280" stroke-linecap="round" />
                              </svg>
                            </span>
                          )}
                        </p>
                        <p className="ts-text-sm ts-font-normal ts-mt-1" style={{ color: '#6b7280' }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Card 4: Placement settings / Edit code */}
        <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-8">
          {selectedOption === 'standard' ? (
            <>
              <h2 className={`ts-text-default ts-text-sm ts-font-bold ts-mb-1 ${isDisabled && 'ts-opacity-25'}`}>
                Placement settings
              </h2>
              <p className={`ts-text-sm ts-font-normal ts-mb-6 ${isDisabled && 'ts-opacity-25'}`} style={{ color: '#6b7280' }}>
                Configure where the Trustbadge appears on your shop pages.
              </p>
              <StandartEditor
                phrasesByKey={phrasesByKey}
                isDisabled={isDisabled}
                trustbadgeDataChild={trustbadgeDataChild}
                placementPhrase={placementPhrase}
                updateTrustbadgeData={updateTrustbadgeData}
              />
            </>
          ) : (
            <EditIntegrationCodeProps
              phrasesByKey={phrasesByKey}
              isDisabled={isDisabled}
              textStr={textStr}
              onChangeScript={onChangeScript}
              setTextStr={setTextStr}
              setIsButtonDisabled={setIsButtonDisabled}
              initialTrustbadgeDataChild={initialTrustbadgeDataChild}
            />
          )}

          <div className="ts-flex ts-justify-end ts-mt-6">
            <button
              id="button_saveChangesTrustbadge"
              data-testid="button_saveChangesTrustbadge"
              type="button"
              disabled={isDisabled || isButtonDisabled}
              onClick={saveDataTrustbadge}
              className="ts-text-white ts-text-sm ts-font-bold ts-px-6 ts-py-2 ts-border-0 ts-cursor-pointer disabled:ts-opacity-50 disabled:ts-cursor-not-allowed"
              style={{
                background: 'linear-gradient(180deg, #1c8dc6 0%, #005aa0 100%)',
                borderRadius: '8px',
                height: '40px',
              }}
            >
              {phrasesByKey.global_button_submit}
            </button>
          </div>
        </div>

        {/* Card 5: About the Trustbadge */}
        <div
          className="ts-rounded-[16px] ts-p-8"
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
            border: '1px solid #E5E7EB',
          }}
        >
          <div className="ts-flex ts-items-start ts-gap-4">
            <div className="ts-flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" fill="#EFF6FF" stroke="#DBEAFE" stroke-width="1" />
                <circle cx="20" cy="20" r="8" stroke="#3B82F6" stroke-width="1.5" fill="none" />
                <path d="M20 17V20.5" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" />
                <circle cx="20" cy="23" r="0.75" fill="#3B82F6" />
              </svg>
            </div>
            <div>
              <p className="ts-text-default ts-text-sm ts-font-bold ts-mb-1">
                About the Trustbadge
              </p>
              <p className="ts-text-sm ts-font-normal ts-mb-3" style={{ color: '#6b7280' }}>
                The Trustbadge displays your Trusted Shops certification, star rating, and provides access to Buyer Protection. It automatically updates with your latest reviews and rating.
              </p>
              <a
                href="https://help.etrusted.com/hc/en-gb/articles/360047497311"
                className="ts-text-sm ts-font-normal ts-inline-flex ts-items-center ts-gap-1"
                style={{ color: '#2563EB' }}
                target="_blank"
                rel="noreferrer"
              >
                Learn more about Trustbadge
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <ApproveDisableModal
          phrasesByKey={phrasesByKey}
          showModal={showModal}
          data={trustbadgeDataCache}
          handleCancel={handleCancel}
          diactivateTB={diactivateTB}
        />
      </div>
    )
  )
}

export default TrustBadgeTab
