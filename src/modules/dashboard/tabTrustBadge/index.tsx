import { h } from 'preact'
import { HelpCircleIcon } from '@/components/layouts/icons/HelpCircleIcon'
import { ChevronRightSmallIcon } from '@/components/layouts/icons/ChevronRightSmallIcon'
import StyledButton from '@/components/controls/styledButton'
import { FC, useState, useEffect } from 'preact/compat'
import { isEqual } from '@/utils'
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
import { TabProps } from '@/modules/type'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import trustbadgeDesktop from '@/assets/trustbadge-desktop.svg'
import trustbadgeMobile from '@/assets/trustbadge-mobile.svg'

const TrustBadgeTab: FC<TabProps> = ({ phrasesByKey }) => {
  const dataRadioButton = [
    { value: 'Standard integration', id: 'standard', desc: 'Automatically integrated trustbadge. The Trustbadge will be displayed on all pages with default settings.' },
    { value: 'Edit integration code', id: 'expert', desc: 'Manually edit the integration code to your needs for more control over placement and styling.' },
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
  const [previewTab, setPreviewTab] = useState<'desktop' | 'mobile'>('mobile')

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

  const isActive = !isDisabled

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

        {/* Card 1: Toggle + Automatic Placement Preview */}
        <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-8">
          <div className="ts-flex ts-items-center ts-justify-between">
            <span className="ts-text-sm ts-font-normal ts-text-default">
              Display on this channel (with automatic placement)
            </span>
            <button
              id="switch_button_trustBadge"
              type="button"
              onClick={() => {
                if (!trustbadgeId) return
                handleSwitch()
              }}
              className="ts-border-0 ts-p-0 ts-cursor-pointer ts-flex-shrink-0"
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: isActive ? '#16A34A' : '#D1D5DB',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                opacity: !trustbadgeId ? 0.25 : 1,
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
                  left: isActive ? '22px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              />
            </button>
          </div>

          <div style={{ borderBottom: '1px solid #E5E7EB', margin: '20px 0' }} />

          <h2
            className="ts-text-default ts-font-bold ts-text-center ts-mb-2"
            style={{ fontSize: '16px' }}
          >
            Automatic Placement
          </h2>
          <p
            className="ts-text-sm ts-font-normal ts-text-center ts-mb-6"
            style={{ color: '#6b7280' }}
          >
            The Trustbadge is automatically placed on your shop website and adapts seamlessly to both desktop and mobile layouts, building customer trust at every touchpoint.
          </p>

          {/* Mobile / Desktop tab toggle */}
          <div className="ts-flex ts-justify-center ts-mb-6">
            <div className="ts-flex" style={{ borderBottom: '2px solid #E5E7EB' }}>
              <button
                type="button"
                onClick={() => setPreviewTab('mobile')}
                className="ts-flex ts-items-center ts-gap-2 ts-px-5 ts-py-2 ts-text-sm ts-font-medium ts-border-0 ts-cursor-pointer ts-bg-transparent"
                style={{
                  color: previewTab === 'mobile' ? '#155DFC' : '#6B7280',
                  borderBottom: previewTab === 'mobile' ? '2px solid #155DFC' : '2px solid transparent',
                  marginBottom: '-2px',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="3.5" y="1.5" width="9" height="13" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none" />
                  <path d="M6.5 12.5H9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
                Mobile
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('desktop')}
                className="ts-flex ts-items-center ts-gap-2 ts-px-5 ts-py-2 ts-text-sm ts-font-medium ts-border-0 ts-cursor-pointer ts-bg-transparent"
                style={{
                  color: previewTab === 'desktop' ? '#155DFC' : '#6B7280',
                  borderBottom: previewTab === 'desktop' ? '2px solid #155DFC' : '2px solid transparent',
                  marginBottom: '-2px',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="2" width="13" height="9" rx="1" stroke="currentColor" stroke-width="1.2" fill="none" />
                  <path d="M5.5 14H10.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                  <path d="M8 11V14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
                Desktop
              </button>
            </div>
          </div>

          <div className="ts-flex ts-justify-center">
            <img
              src={previewTab === 'desktop' ? trustbadgeDesktop : trustbadgeMobile}
              alt={`Trustbadge ${previewTab} preview`}
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          </div>
        </div>

        {/* Card 2: Trustbadge integration */}
        <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-8">
          <h2
            className="ts-text-default ts-font-bold ts-mb-1"
            style={{ fontSize: '16px' }}
          >
            Trustbadge integration
          </h2>
          <p className="ts-text-sm ts-font-normal ts-mb-6" style={{ color: '#6b7280' }}>
            Select how you want to integrate the Trustbadge into your shop.
          </p>

          {infoOfSystem.allowsEditIntegrationCode ? (
            <div className="ts-flex ts-flex-col ts-gap-3">
              {dataRadioButton.map(({ value, id, desc }) => {
                const isSelected = selectedOption === id && !isDisabled
                return (
                  <div
                    key={id}
                    className={`ts-rounded-[10px] ${isDisabled ? 'ts-opacity-50 ts-cursor-not-allowed' : 'ts-cursor-pointer'}`}
                    style={{
                      border: isSelected ? '1px solid #BFDBFE' : '1px solid #E5E7EB',
                      backgroundColor: isSelected ? 'rgba(239, 246, 255, 0.50)' : '#FFFFFF',
                      padding: '16px 20px',
                    }}
                    onClick={() => {
                      if (isDisabled) return
                      setSelectedOption(id)
                    }}
                  >
                    <div className="ts-flex ts-items-start ts-gap-3">
                      <div
                        className="ts-flex ts-items-center ts-justify-center ts-flex-shrink-0 ts-mt-0.5"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #155DFC' : '2px solid #D1D5DB',
                          backgroundColor: isSelected ? '#155DFC' : '#FFFFFF',
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
                      <div className="ts-flex-1">
                        <p className="ts-text-sm ts-font-bold ts-text-default">{value}</p>
                        <p
                          className="ts-text-sm ts-font-normal ts-mt-1"
                          style={{ color: '#6b7280' }}
                        >
                          {desc}
                        </p>
                      </div>
                    </div>

                    {isSelected && id === 'standard' && (
                      <div className="ts-mt-6" onClick={e => e.stopPropagation()}>
                        <p
                          className="ts-text-sm ts-font-normal ts-mb-4"
                          style={{ color: '#374151' }}
                        >
                          Customize the position of the Trustbadge on your website.
                        </p>
                        <StandartEditor
                          phrasesByKey={phrasesByKey}
                          isDisabled={isDisabled}
                          trustbadgeDataChild={trustbadgeDataChild}
                          placementPhrase={placementPhrase}
                          updateTrustbadgeData={updateTrustbadgeData}
                        />
                      </div>
                    )}

                    {isSelected && id === 'expert' && (
                      <div onClick={e => e.stopPropagation()}>
                        <EditIntegrationCodeProps
                          phrasesByKey={phrasesByKey}
                          isDisabled={isDisabled}
                          textStr={textStr}
                          onChangeScript={onChangeScript}
                          setTextStr={setTextStr}
                          setIsButtonDisabled={setIsButtonDisabled}
                          initialTrustbadgeDataChild={initialTrustbadgeDataChild}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <>
              <p
                className="ts-text-sm ts-font-normal ts-mb-4"
                style={{ color: '#374151' }}
              >
                Customize the position of the Trustbadge on your website.
              </p>
              <StandartEditor
                phrasesByKey={phrasesByKey}
                isDisabled={isDisabled}
                trustbadgeDataChild={trustbadgeDataChild}
                placementPhrase={placementPhrase}
                updateTrustbadgeData={updateTrustbadgeData}
              />
            </>
          )}

          <div className="ts-flex ts-justify-end ts-mt-6">
            <StyledButton
              id="saveChangesTrustbadge"
              variant="primary"
              height={40}
              disabled={isDisabled || isButtonDisabled}
              onClick={saveDataTrustbadge}
            >
              {phrasesByKey.global_button_submit}
            </StyledButton>
          </div>
        </div>

        {/* About the Trustbadge */}
        <div
            className="ts-rounded-[14px] ts-shadow-md ts-p-4 sm:ts-p-8"
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
                About the Trustbadge
              </p>
              <p
                className="ts-text-sm ts-font-normal ts-mb-3"
                style={{ color: '#6b7280' }}
              >
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
                <ChevronRightSmallIcon />
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
