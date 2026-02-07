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

      {/* Card 1: Channel mapping */}
      <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-8">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          {phrasesByKey.application_settings_channel_title}
        </h2>
        <p className="ts-text-default ts-text-sm ts-mb-6" style={{ color: '#6b7280' }}>
          {phrasesByKey.application_settings_channel_description?.replace(
            '[%]shopsystem[%]',
            infoOfSystem.nameOfSystem,
          )}
        </p>

        {/* Important warning box */}
        <div
          className="ts-flex ts-items-start ts-gap-3 ts-p-4 ts-mb-8"
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderLeft: '4px solid #D97706',
            borderRadius: '10px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="ts-flex-shrink-0 ts-mt-0.5"
          >
            <path
              d="M8.57465 3.21665L1.51632 14.9833C1.37079 15.2353 1.29379 15.5214 1.29298 15.8128C1.29216 16.1042 1.36756 16.3907 1.51167 16.6436C1.65578 16.8964 1.86359 17.1069 2.11468 17.2543C2.36578 17.4016 2.65124 17.4808 2.94265 17.4833H17.0577C17.3491 17.4808 17.6345 17.4016 17.8856 17.2543C18.1367 17.1069 18.3445 16.8964 18.4886 16.6436C18.6328 16.3907 18.7082 16.1042 18.7073 15.8128C18.7065 15.5214 18.6295 15.2353 18.484 14.9833L11.4257 3.21665C11.2771 2.97174 11.0673 2.76905 10.8171 2.62891C10.567 2.48877 10.2848 2.41553 9.99798 2.41553C9.71118 2.41553 9.42901 2.48877 9.17884 2.62891C8.92867 2.76905 8.71887 2.97174 8.57465 3.21665Z"
              stroke="#D97706"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
            <path d="M10 7.5V10.8333" stroke="#D97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 14.1667H10.0083" stroke="#D97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
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
              <button
                id="button_settingsSaveChannels"
                data-testid="button_settingsSaveChannels"
                type="button"
                onClick={saveChannelsInBL}
                disabled={isButtonDisabled}
                className="ts-text-white ts-text-sm ts-font-bold ts-px-6 ts-py-2.5 ts-border-0 ts-cursor-pointer disabled:ts-opacity-50 disabled:ts-cursor-not-allowed"
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
        )}
      </div>

      {/* Card 2: Disconnect integration */}
      <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-8">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          {phrasesByKey.application_settings_disconnect_title}
        </h2>
        <p className="ts-text-sm ts-mb-6" style={{ color: '#6b7280' }}>
          {phrasesByKey.application_settings_disconnect_description}
        </p>

        {/* Red warning box */}
        <div
          className="ts-flex ts-items-center ts-justify-between ts-gap-6 ts-p-4"
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderLeft: '4px solid #DC2626',
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
          <button
            id="button_settingsDisconnectOpenModal"
            data-testid="button_settingsDisconnectOpenModal"
            type="button"
            onClick={() => setShowModal(true)}
            className="ts-flex-shrink-0 ts-text-sm ts-font-bold ts-px-5 ts-py-2 ts-bg-white ts-cursor-pointer"
            style={{
              color: '#DC2626',
              border: '1.5px solid #DC2626',
              borderRadius: '8px',
              height: '36px',
            }}
          >
            {phrasesByKey.application_settings_disconnect_button}
          </button>
        </div>
      </div>

      {/* Card 3: Need help */}
      <div
        className="ts-rounded-[16px] ts-p-8 mb-8"
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
          border: '1px solid #E5E7EB',
        }}
      >
        <div className="ts-flex ts-items-start ts-gap-4">
          <div className="ts-flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <circle cx="20" cy="20" r="19" fill="#EFF6FF" stroke="#DBEAFE" stroke-width="1" />
              <path
                d="M20 12.5C17.5 12.5 15.5 14.5 15.5 17H17.5C17.5 15.62 18.62 14.5 20 14.5C21.38 14.5 22.5 15.62 22.5 17C22.5 18.38 21.38 19.5 20 19.5C19.45 19.5 19 19.95 19 20.5V22.5H21V21.33C22.97 20.72 24.5 18.97 24.5 17C24.5 14.5 22.5 12.5 20 12.5Z"
                fill="#3B82F6"
              />
              <path d="M19 24.5H21V26.5H19V24.5Z" fill="#3B82F6" />
            </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3L7.5 6L4.5 9" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
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
