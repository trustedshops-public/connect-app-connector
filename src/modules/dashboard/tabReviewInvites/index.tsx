import { h } from 'preact'
import { FC, useState, useEffect } from 'preact/compat'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { ScrinSpinner } from '@/components/layouts/spinner'
import {
  selectAllState,
  selectorAuth,
  selectorChannels,
  selectorInfoOfSystem,
  selectorReviewInvites,
} from '@/store/selector'
import SendReviewInvitesForProducts from './sendReviewInvitesForProducts'
import SendReviewInvitesRightTime from './sendReviewInvitesRightTime'
import SendReviewInvitesForPreviousOrders from './sendReviewInvitesForPreviousOrders'
import useStore from '@/store/useStore'
import { TabProps } from '@/modules/type'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'

const ReviewInvitesTab: FC<TabProps> = ({ phrasesByKey }) => {
  const [isToggle, setIsToggle] = useState(false)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const { selectedShopChannels } = useStore(selectorChannels)
  const {
    setIsLoadingInvitesForProducts,
    changeUseTimeOfSendReviewInvites,
    changeNumberOfDays,
    onExport,
    saveChangeUseTimeOfSendReviewInvites,
  } = useStore()
  const {
    invitesForProducts,
    initialDateToSendReviewInvites,
    numberOfDays,
    isLoading,
    typesReviewInvites,
    isMappedTypesErorr,
  } = useStore(selectorReviewInvites)

  const allState = useStore(selectAllState)
  const { user } = useStore(selectorAuth)

  useEffect(() => {
    if (!invitesForProducts) return setIsToggle(false)
    setIsToggle(!!invitesForProducts?.eTrustedChannelRef)
  }, [invitesForProducts])

  useEffect(() => {
    if (!selectedShopChannels?.eTrustedChannelRef) {
      setIsToggle(false)
      return
    }
  }, [selectedShopChannels])

  const handleToggle = () => {
    setIsLoadingInvitesForProducts(true)
    dispatchAction(
      !isToggle
        ? {
            action: EVENTS.ACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL,
            payload: selectedShopChannels,
          }
        : {
            action: EVENTS.DEACTIVATE_PRODUCT_REVIEW_FOR_CHANNEL,
            payload: {
              id: selectedShopChannels.eTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          },
    )
  }

  const saveChanges = async () => {
    await saveChangeUseTimeOfSendReviewInvites()
    handleEtrustedConfiguration(user?.access_token, allState, putEtrustedConfiguration)
  }

  return (
    <div className="ts-w-full ts-flex ts-flex-col ts-gap-8">
      {isLoading && <ScrinSpinner />}

      {infoOfSystem.allowsSendReviewInvitesForProduct && (
        <SendReviewInvitesForProducts
          phrasesByKey={phrasesByKey}
          isToggle={isToggle}
          handleToggle={handleToggle}
          selectedShopChannels={selectedShopChannels}
        />
      )}

      {(infoOfSystem.allowsEstimatedDeliveryDate || infoOfSystem.allowsEventsByOrderStatus) && (
        <SendReviewInvitesRightTime
          phrasesByKey={phrasesByKey}
          saveChanges={saveChanges}
          changeUseTimeOfSendReviewInvites={changeUseTimeOfSendReviewInvites}
          selectedShopChannels={selectedShopChannels}
          typesReviewInvites={typesReviewInvites}
          initialDateToSendReviewInvites={initialDateToSendReviewInvites}
          isMappedTypesErorr={isMappedTypesErorr}
        />
      )}
      {infoOfSystem.allowsSendReviewInvitesForPreviousOrders && (
        <SendReviewInvitesForPreviousOrders
          phrasesByKey={phrasesByKey}
          selectedShopChannels={selectedShopChannels}
          numberOfDays={numberOfDays}
          changeNumberOfDays={changeNumberOfDays}
          onExport={onExport}
        />
      )}
    </div>
  )
}

export default ReviewInvitesTab
