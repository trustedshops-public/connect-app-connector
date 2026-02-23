import { h } from 'preact'
import { FC, useEffect, useState } from 'preact/compat'
import { isEqual } from '@/utils'
import ChannelSelectionForm from '@/modules/dashboard/channelSelectionForm'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { ScrinSpinner } from '@/components/layouts/spinner'
import useStore from '@/store/useStore'
import { selectAllState, selectorAuth, selectorChannels, selectorInfoOfSystem } from '@/store/selector'
import ApproveDisconnectModal from './approveDisconnectModal'
import { TabProps } from '@/modules/type'
import { ActionTypes, postEtrustedInteractions, putEtrustedConfiguration } from '@/api/api'
import {
  handleEtrustedConfiguration,
  handleEtrustedInteraction,
} from '@/utils/configurationDataHandler'
import { WarningTriangleIcon } from '@/components/layouts/icons/WarningTriangleIcon'
import { ChevronRightSmallIcon } from '@/components/layouts/icons/ChevronRightSmallIcon'
import { GearIcon } from '@/components/layouts/icons/GearIcon'
import StyledButton from '@/components/controls/styledButton'

const SettingsTab: FC<TabProps> = ({ phrasesByKey }) => {
  const {
    isDisconnectLoading,
    selectedChannels,
    isLoadingSave,
    initialSelectedChannels,
    shopChannels,
  } = useStore(selectorChannels)

  const {
    setIsLoadingSave,
    setShowChannelModal,
    setIsDisconnectLoading,
    saveTrustbadgesAfterRemappingChannels,
    setInitialOrderStatusByMapping,
  } = useStore()

  const allState = useStore(selectAllState)
  const { user } = useStore(selectorAuth)

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [showModal, setShowModal] = useState<boolean>(false)

  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  const displayReviewTab =
    infoOfSystem.allowsEstimatedDeliveryDate ||
    infoOfSystem.allowsEventsByOrderStatus ||
    infoOfSystem.allowsSendReviewInvitesForPreviousOrders ||
    infoOfSystem.allowsSendReviewInvitesForProduct

  useEffect(() => {
    setIsButtonDisabled(isEqual(initialSelectedChannels, selectedChannels))
  }, [initialSelectedChannels, selectedChannels])

  const saveChannelsInBL = () => {
    setIsLoadingSave(true)
    dispatchAction({
      action: EVENTS.SAVE_MAPPED_CHANNEL,
      payload: selectedChannels,
    })
    displayReviewTab && setInitialOrderStatusByMapping(selectedChannels)
    setShowChannelModal(false)
    selectedChannels.forEach(channel => {
      if (
        initialSelectedChannels.some(
          item =>
            item.eTrustedChannelRef === channel.eTrustedChannelRef &&
            item.salesChannelRef === channel.salesChannelRef,
        )
      ) {
        return
      }
      saveTrustbadgesAfterRemappingChannels(channel)
    })
    handleEtrustedConfiguration(user?.access_token, allState, 'settings', putEtrustedConfiguration)
  }

  const onDisconnect = () => {
    setIsDisconnectLoading(true)
    dispatchAction({ action: EVENTS.DISCONNECTED, payload: null })
    handleEtrustedInteraction(
      user?.access_token,
      allState,
      ActionTypes.DISCONNECTED,
      'settings',
      postEtrustedInteractions,
    )
  }

  return (
    <div className="ts-flex ts-flex-col ts-gap-6">
      {(isLoadingSave || isDisconnectLoading) && <ScrinSpinner />}

      {/* Channel mapping header - no card */}
      <div className="ts-pb-2">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          {phrasesByKey.application_settings_channel_title}
        </h2>
        <p className="ts-text-default ts-text-sm" style={{ color: '#6b7280' }}>
          {phrasesByKey.application_settings_channel_description?.replace(
            '[%]shopsystem[%]',
            infoOfSystem.nameOfSystem,
          )}
        </p>
      </div>

      {/* Card: Warning + Channel mapping + Save */}
      <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-4 sm:ts-p-8">
        {/* Important warning box */}
        <div
          className="ts-flex ts-items-start ts-gap-3 ts-p-4 ts-mb-8"
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '10px',
          }}
        >
          <WarningTriangleIcon customClass="ts-flex-shrink-0 ts-mt-0.5" />
          <div>
            <p className="ts-text-sm ts-font-bold ts-mb-1" style={{ color: '#92400E' }}>Important</p>
            <p className="ts-text-sm ts-font-normal" style={{ color: '#B45309' }}>
              {phrasesByKey.application_settings_channel_caution}
            </p>
          </div>
        </div>

        {/* Channel mapping rows */}
        {shopChannels && !!shopChannels.length && (
          <div className="ts-mb-6">
            <ChannelSelectionForm phrasesByKey={phrasesByKey} />

            <div className="ts-flex ts-justify-end ts-mt-6">
              <StyledButton id="settingsSaveChannels" variant="primary" height={40} disabled={isButtonDisabled} onClick={saveChannelsInBL}>
                {phrasesByKey.global_button_submit}
              </StyledButton>
            </div>
          </div>
        )}
      </div>

      {/* Card 2: Disconnect integration */}
      <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-4 sm:ts-p-8">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          {phrasesByKey.application_settings_disconnect_title}
        </h2>
        <p className="ts-text-sm ts-mb-6" style={{ color: '#6b7280' }}>
          {phrasesByKey.application_settings_disconnect_description}
        </p>

        {/* Red warning box */}
        <div
          className="ts-flex ts-flex-col sm:ts-flex-row sm:ts-items-center ts-justify-between ts-gap-4 sm:ts-gap-6 ts-p-4"
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
          }}
        >
          <div>
            <p className="ts-text-sm ts-font-bold ts-mb-1" style={{ color: '#991B1B' }}>
              This action cannot be undone
            </p>
            <p className="ts-text-sm ts-font-normal" style={{ color: '#B91C1C' }}>
              {phrasesByKey.application_settings_disconnect_warning}
            </p>
          </div>
          <StyledButton id="settingsDisconnectOpenModal" variant="danger" className="ts-flex-shrink-0" onClick={() => setShowModal(true)}>
            {phrasesByKey.application_settings_disconnect_button}
          </StyledButton>
        </div>
      </div>

      {/* Card 3: Need help */}
      <div
        className="ts-rounded-[16px] ts-shadow-md ts-p-4 sm:ts-p-8 mb-8"
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
            <GearIcon customClass="ts-text-blue-600" />
          </div>
          <div>
            <p className="ts-text-default ts-text-sm ts-font-bold ts-mb-1">
              Need help with integration?
            </p>
            <p className="ts-text-sm ts-font-normal ts-mb-3" style={{ color: '#6b7280' }}>
              Learn more about channel mapping, multi-channel setup, and troubleshooting in our Help Center.
            </p>
            <a
              href={phrasesByKey.application_settings_disconnect_help_url_1}
              className="ts-text-sm ts-font-normal ts-inline-flex ts-items-center ts-gap-1"
              style={{ color: '#2563EB' }}
              target="_blank"
              rel="noreferrer"
            >
              Contact us
              <ChevronRightSmallIcon />
            </a>
          </div>
        </div>
      </div>

      <ApproveDisconnectModal
        phrasesByKey={phrasesByKey}
        showModal={showModal}
        handleCancel={setShowModal}
        onDisconnect={onDisconnect}
      />
    </div>
  )
}

export default SettingsTab
