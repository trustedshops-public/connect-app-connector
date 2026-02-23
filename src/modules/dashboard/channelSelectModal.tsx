import { h, Fragment } from 'preact'
import { FC } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'
import { dispatchAction, EVENTS } from '@/eventsLib'

import ChannelSelectionForm from './channelSelectionForm'
import StyledButton from '@/components/controls/styledButton'
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
  const modalRef = useRef<HTMLDivElement>(null)
  const {
    setIsLoadingSave,
    setInitialOrderStatusByMapping,
    saveTrustbadgesAfterRemappingChannels,
  } = useStore()
  const { selectedChannels, initialSelectedChannels } = useStore(selectorChannels)
  const allState = useStore(selectAllState)
  const { user } = useStore(selectorAuth)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  const displayReviewTab =
    infoOfSystem.allowsEstimatedDeliveryDate ||
    infoOfSystem.allowsEventsByOrderStatus ||
    infoOfSystem.allowsSendReviewInvitesForPreviousOrders ||
    infoOfSystem.allowsSendReviewInvitesForProduct

  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus()
    }
  }, [showModal])

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
    <Fragment>
      {showModal && (
        <Fragment>
          <div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            className="ts-justify-center ts-items-center ts-flex ts-overflow-x-hidden ts-overflow-y-auto ts-fixed ts-inset-0 ts-z-50 ts-outline-none focus:ts-outline-none ts-font-sans"
          >
            <div
              className="ts-relative ts-w-full ts-mx-4 ts-my-4 sm:ts-mx-auto sm:ts-my-0"
              style={{ maxWidth: '600px' }}
            >
              <div
                className="ts-bg-white"
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div className="ts-p-5 sm:ts-p-10">
                  <h2
                    className="ts-text-default ts-font-bold ts-mb-2"
                    style={{ fontSize: '20px', lineHeight: '28px' }}
                  >
                    {phrasesByKey?.channelSelect_titel}
                  </h2>
                  <p className="ts-text-sm ts-font-normal ts-mb-6" style={{ color: '#6b7280' }}>
                    Assigning a channel to each shop in your shop system ensures reviews are collected for the right URL.
                  </p>

                  <ChannelSelectionForm phrasesByKey={phrasesByKey} />

                  <StyledButton
                    id="saveChannelsModal"
                    variant="primary"
                    fullWidth
                    height={44}
                    disabled={!selectedChannels.length}
                    onClick={() => saveChannelsInBL()}
                    className="ts-mt-6"
                  >
                    {phrasesByKey?.channelSelect_submit}
                  </StyledButton>

                  <p
                    className="ts-text-sm ts-font-normal ts-mt-4 ts-text-center"
                    style={{ color: '#9CA3AF' }}
                  >
                    {phrasesByKey?.channelSelect_info}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="ts-opacity-50 ts-fixed ts-inset-0 ts-z-40 ts-bg-black" />
        </Fragment>
      )}
    </Fragment>
  )
}

export default ChannelSelectModal
