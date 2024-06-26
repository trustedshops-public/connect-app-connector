import { h } from 'preact'
import { FC, useState, useEffect } from 'preact/compat'
import { isEqual } from '@/utils'
import { Radio, RadioGroup } from '@/components/controls/radio'
import ApproveDisableModal from './approveDisableModal'
import Button, { ButtonThemes } from '@/components/controls/buttun'
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

const TrustBadgeTab: FC<TabProps> = ({ phrasesByKey }) => {
  const dataRadioButton = [
    { value: phrasesByKey?.application_trustbadge_radioButton_standard, id: 'standard' },
    { value: phrasesByKey?.application_trustbadge_radioButton_expert, id: 'expert' },
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
      <div className="ts-w-full ts-bg-white ts-p-8 ts-shadow-md ts-rounded-b">
        {(isLoadingAPI || isLoadingBL || isLoadingSave) && <ScrinSpinner />}

        <TrustBadgeSwitcher handleSwitch={handleSwitch} phrasesByKey={phrasesByKey} />
        <div className="ts-ml-28 ts-mb-6">
          <p
            className={`ts-text-default ts-text-sm ts-font-bold  ${isDisabled && 'ts-opacity-25'}`}
          >
            {phrasesByKey.application_trustbadge_integrationmode}
          </p>
        </div>
        {infoOfSystem.allowsEditIntegrationCode && (
          <div className="ts-ml-28">
            <RadioGroup
              onChange={setSelectedOption}
              disabled={isDisabled}
              formClassNames={'ts-flex ts-gap-4 ts-w-max'}
            >
              {dataRadioButton.map(({ value, id }) => (
                <Radio
                  id={id}
                  key={id}
                  value={selectedOption}
                  disabled={isDisabled}
                  customClass="first:ts-pb-4"
                >
                  <p
                    id={id.toString()}
                    className="ts-text-sm ts-font-medium ts-text-default ts-block ts-cursor-pointer"
                  >
                    {value}
                  </p>
                </Radio>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="ts-ml-28 ts-my-6">
          {selectedOption === 'standard' ? (
            <StandartEditor
              phrasesByKey={phrasesByKey}
              isDisabled={isDisabled}
              trustbadgeDataChild={trustbadgeDataChild}
              placementPhrase={placementPhrase}
              updateTrustbadgeData={updateTrustbadgeData}
            />
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
        </div>
        <div className="ts-flex ts-items-center ts-justify-end">
          <Button
            id={'saveChangesTrustbadge'}
            label={phrasesByKey.global_button_submit}
            theme={ButtonThemes.Primary}
            disabled={isDisabled || isButtonDisabled}
            onClick={saveDataTrustbadge}
          />
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
