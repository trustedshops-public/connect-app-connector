import { h } from 'preact'
import { HelpCircleIcon } from '@/components/layouts/icons/HelpCircleIcon'
import { ChevronRightSmallIcon } from '@/components/layouts/icons/ChevronRightSmallIcon'
import { MobilePhoneIcon } from '@/components/layouts/icons/MobilePhoneIcon'
import { DesktopMonitorIcon } from '@/components/layouts/icons/DesktopMonitorIcon'
import StyledButton from '@/components/controls/styledButton'
import { FC, Fragment, useState, useEffect } from 'preact/compat'
import { isEqual } from '@/utils'
import ApproveDisableModal from './approveDisableModal'
import { dispatchAction, EVENTS } from '@/eventsLib'
import {
  getParsedTrustbadgeDataStrToObj,
  getParsedTrustbadgeDataToString,
} from '@/modules/dashboard/tabTrustBadge/parseTrustbadgeData'
import { ScrinSpinner } from '@/components/layouts/spinner'
import {
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
    { value: phrasesByKey.application_trustbadge_radioButtonOptions_standard_value, id: 'standard', desc: phrasesByKey.application_trustbadge_radioButtonOptions_standard_description },
    { value: phrasesByKey.application_trustbadge_radioButtonOptions_expert_value, id: 'expert', desc: phrasesByKey.application_trustbadge_radioButtonOptions_expert_description },
  ]
  const placementPhrase = {
    left: phrasesByKey.application_trustbadge_placementSection_left,
    right: phrasesByKey.application_trustbadge_placementSection_right,
    center: phrasesByKey.application_trustbadge_placementSection_center,
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

  const getFreshAllState = () => {
    const store = useStore.getState()
    const { auth: _auth, ...restTrustbadgeState } = store.trustbadgeState as any
    return {
      infoState: store.infoState,
      channelState: store.channelState,
      trustbadgeState: restTrustbadgeState,
      notificationState: store.notificationState,
      reviewInvitesState: store.reviewInvitesState,
      widgetState: store.widgetState,
      ...(store.infoState.infoOfSystem.allowsSupportTrstdLogin && {
        trstdLoginState: store.trstdLoginState,
      }),
    }
  }

  const handleSwitch = () => {
    if (!isDisabled) {
      setShowModal(true)
      return
    }
    setIsLoadingBL(true)
    const enabledChild = {
      tag: trustbadgeDataChild.tag,
      attributes: {
        ...trustbadgeDataChild.attributes,
        'data-disable-trustbadge': {
          value: false,
          attributeName: 'data-disable-trustbadge',
        },
      },
    }
    updateTrustbadgeDataFromTextaria(enabledChild)
    dispatchAction({
      action: EVENTS.SAVE_TRUSTBADGE_CONFIGURATION,
      payload: {
        id: trustbadgeId,
        eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
        salesChannelRef: selectedShopChannels.salesChannelRef,
        children: [enabledChild],
      },
    })
    handleEtrustedConfiguration(
      user?.access_token,
      getFreshAllState(),
      'trustbadge',
      putEtrustedConfiguration,
    )
  }

  const diactivateTB = (data: Nullable<ITrustbadgeChildren>): void => {
    setIsLoadingBL(true)
    const disabledChild = data || {
      tag: trustbadgeDataChild.tag,
      attributes: {
        ...trustbadgeDataChild.attributes,
        'data-disable-trustbadge': {
          value: true,
          attributeName: 'data-disable-trustbadge',
        },
      },
    }
    updateTrustbadgeDataFromTextaria(disabledChild)
    dispatchAction({
      action: EVENTS.SAVE_TRUSTBADGE_CONFIGURATION,
      payload: {
        id: trustbadgeId,
        eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
        salesChannelRef: selectedShopChannels.salesChannelRef,
        children: [disabledChild],
      },
    })
    handleEtrustedConfiguration(
      user?.access_token,
      getFreshAllState(),
      'trustbadge',
      putEtrustedConfiguration,
    )
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
      getFreshAllState(),
      'trustbadge',
      putEtrustedConfiguration,
    )
  }

  return (
    phrasesByKey && (
      <div className="ts-flex ts-flex-col ts-gap-6">
        {(isLoadingAPI || isLoadingBL || isLoadingSave) && <ScrinSpinner />}

        {/* Trustbadge header - no card */}
        <div className="ts-pb-1">
          <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
            {phrasesByKey.application_trustbadge_titel}
          </h2>
          <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280' }}>
            {phrasesByKey.application_trustbadge_description}
          </p>
        </div>

        {/* Card 1: Toggle + Automatic Placement Preview */}
        <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-6">
          <div className="ts-flex ts-items-center ts-justify-between">
            <span className="ts-text-sm ts-font-normal ts-text-default">
              {phrasesByKey.application_trustbadge_displayToggle_label}
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
          <p
            className="ts-text-sm ts-font-normal ts-text-center ts-p-6 sm:ts-p-8 ts-max-w-[780px] ts-mx-auto"
            style={{ color: '#6b7280' }}
          >
            {phrasesByKey.application_trustbadge_automaticPlacement_description}
          </p>

          {/* Mobile / Desktop tab toggle */}
          <div className="ts-flex ts-justify-center ts-mb-6">
            <div className="ts-flex">
              <button
                type="button"
                onClick={() => setPreviewTab('mobile')}
                className="ts-flex ts-items-center ts-gap-2 ts-px-5 ts-py-2 ts-text-sm ts-font-medium ts-border-0 ts-cursor-pointer ts-bg-transparent ts-rounded-none"
                style={{
                  color: previewTab === 'mobile' ? '#155DFC' : '#6B7280',
                  borderBottom: previewTab === 'mobile' ? '2px solid #155DFC' : 'none',
                }}
              >
                <MobilePhoneIcon />
                {phrasesByKey.application_trustbadge_preview_mobile}
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('desktop')}
                className="ts-flex ts-items-center ts-gap-2 ts-px-5 ts-py-2 ts-text-sm ts-font-medium ts-border-0 ts-cursor-pointer ts-bg-transparent ts-rounded-none"
                style={{
                  color: previewTab === 'desktop' ? '#155DFC' : '#6B7280',
                  borderBottom: previewTab === 'desktop' ? '2px solid #155DFC' : 'none',
                }}
              >
                <DesktopMonitorIcon />
                {phrasesByKey.application_trustbadge_preview_desktop}
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
        <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-6">
          <h2
            className="ts-text-default ts-font-bold ts-mb-1"
            style={{ fontSize: '16px' }}
          >
            {phrasesByKey.application_trustbadge_integration_title}
          </h2>
          <p className="ts-text-sm ts-font-normal ts-mb-6" style={{ color: '#6b7280' }}>
            {phrasesByKey.application_trustbadge_integration_description}
          </p>

          <div style={{ borderBottom: '1px solid #E5E7EB', margin: '20px 0' }} />

          {infoOfSystem.allowsEditIntegrationCode ? (
            <div className="ts-flex ts-flex-col ts-gap-3">
              {dataRadioButton.map(({ value, id, desc }) => {
                const isSelected = selectedOption === id && !isDisabled
                return (
                  <div
                    key={id}
                    className={`ts-rounded-[10px] ${isDisabled ? 'ts-opacity-50 ts-cursor-not-allowed' : 'ts-cursor-pointer'}`}
                    style={{
                      border: isSelected ? '2px solid #2B7FFF' : '1px solid #E5E7EB',
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
                {phrasesByKey.application_trustbadge_integration_description}
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
                {phrasesByKey.application_trustbadge_about_title}
              </p>
              <p
                className="ts-text-sm ts-font-normal ts-mb-3"
                style={{ color: '#6b7280' }}
              >
                {phrasesByKey.application_trustbadge_about_description}
              </p>
              <a
                href={phrasesByKey.application_trustbadge_about_learnMore_url}
                className="ts-text-sm ts-font-normal ts-inline-flex ts-items-center ts-gap-1"
                style={{ color: '#2563EB' }}
                target="_blank"
                rel="noreferrer"
              >
                {phrasesByKey.application_trustbadge_about_learnMore}
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
