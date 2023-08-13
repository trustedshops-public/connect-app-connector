import { h } from 'preact'
import { FC, useState, useEffect } from 'preact/compat'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { ScrinSpinner } from '@/components/layouts/spinner'
import { selectorChannels, selectorInfoOfSystem, selectorReviewInvites } from '@/store/selector'
import { DASHBOADR_KEYS } from '@/locales/types'
import useStore from '@/store/useStore'
import SendReviewInvitesRightTime_2 from './sendReviewInvitesRightTime_2'
import SendReviewInvitesForPreviousOrders_2 from './sendReviewInvitesForPreviousOrders_2'

interface Props {
  phrasesByKey: DASHBOADR_KEYS
}

const ReviewInvitesTab_2: FC<Props> = ({ phrasesByKey }) => {
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
          }
    )
  }

  const saveChanges = async () => {
    await saveChangeUseTimeOfSendReviewInvites()
  }

  return (
    <div className="ts-w-full ts-flex ts-flex-col ts-gap-8">
      {isLoading && <ScrinSpinner />}

      {(infoOfSystem.allowsEstimatedDeliveryDate || infoOfSystem.allowsEventsByOrderStatus) && (
        <SendReviewInvitesRightTime_2
          phrasesByKey={phrasesByKey}
          saveChanges={saveChanges}
          changeUseTimeOfSendReviewInvites={changeUseTimeOfSendReviewInvites}
          selectedShopChannels={selectedShopChannels}
          typesReviewInvites={typesReviewInvites}
          initialDateToSendReviewInvites={initialDateToSendReviewInvites}
          isMappedTypesErorr={isMappedTypesErorr}
          showProductReviews={!!infoOfSystem.allowsSendReviewInvitesForProduct}
        />
      )}

      {infoOfSystem.allowsSendReviewInvitesForPreviousOrders && (
        <SendReviewInvitesForPreviousOrders_2
          phrasesByKey={phrasesByKey}
          selectedShopChannels={selectedShopChannels}
          numberOfDays={numberOfDays}
          changeNumberOfDays={changeNumberOfDays}
          onExport={onExport}
          isToggle={isToggle}
          handleToggle={handleToggle}
        />
      )}
    </div>
  )
}

export default ReviewInvitesTab_2
