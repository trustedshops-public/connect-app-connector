import { h } from 'preact'
import { FC } from 'preact/compat'
import Button, { ButtonThemes } from '@/components/controls/buttun'
import Modal from '@/components/layouts/modal'
import { dispatchAction, EVENTS } from '@/eventsLib'
import settingsImg from '@/assets/Feature_related_Settings.svg'

import ChannelSelectionForm from './channelSelectionForm'
import { DASHBOARD_KEYS } from '@/locales/types'
import useStore from '@/store/useStore'
import { selectAllState, selectorAuth, selectorChannels, selectorInfoOfSystem } from '@/store/selector'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'


interface Props {
  phrasesByKey: Nullable<DASHBOARD_KEYS>
  showModal: boolean
  setShowModal: (value: boolean) => void
}

const ChannelSelectModal: FC<Props> = ({ phrasesByKey, showModal, setShowModal }) => {
  const {
    setIsLoadingSave,
    setInitialOrderStatusByMapping,
    saveTrustbadgesAfterRemappingChannels,
  } = useStore()
  const { selectedChannels, initialSelectedChannels, } = useStore(selectorChannels)
  const allState = useStore(selectAllState)
  const { user } = useStore(selectorAuth)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  const displayReviewTab =
    infoOfSystem.allowsEstimatedDeliveryDate ||
    infoOfSystem.allowsEventsByOrderStatus ||
    infoOfSystem.allowsSendReviewInvitesForPreviousOrders ||
    infoOfSystem.allowsSendReviewInvitesForProduct

  const saveChannelsInBL = () => {
    setIsLoadingSave(true)
    dispatchAction({
      action: EVENTS.SAVE_MAPPED_CHANNEL,
      payload: selectedChannels,
    })
    displayReviewTab && setInitialOrderStatusByMapping(selectedChannels)
    setShowModal(false)
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
    handleEtrustedConfiguration(
      user?.access_token,
      allState,
      'channelSelector',
      putEtrustedConfiguration,
    )
  }

  return (
    <Modal
      showModal={showModal}
      footerContent={
        <div className="ts-flex ts-gap-2">
          <Button
            id={'saveChannelsModal'}
            label={phrasesByKey && phrasesByKey.channelSelect_submit}
            theme={ButtonThemes.Primary}
            disabled={!selectedChannels.length}
            onClick={() => saveChannelsInBL()}
          />
        </div>
      }
    >
      <div className="ts-font-sans ts-flex ts-w-max">
        <span className="ts-w-20 ts-h-20">
          <img src={settingsImg} alt="settings" />
        </span>
        <div className="ts-ml-8">
          <p className="ts-mb-8 ts-text-default ts-text-md ts-font-bold">
            {phrasesByKey?.channelSelect_titel}
          </p>

          <ChannelSelectionForm phrasesByKey={phrasesByKey} />
          <p className="ts-text-default ts-text-sm ts-font-normal ts-mt-6">
            {phrasesByKey?.channelSelect_info}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default ChannelSelectModal
