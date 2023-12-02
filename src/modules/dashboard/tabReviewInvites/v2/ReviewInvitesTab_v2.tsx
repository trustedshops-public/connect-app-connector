import { h } from 'preact'
import { FC, useState } from 'preact/compat'
import { ScrinSpinner } from '@/components/layouts/spinner'
import { selectorChannels, selectorInfoOfSystem, selectorReviewInvites } from '@/store/selector'
import useStore from '@/store/useStore'
import SendReviewInvitesRightTime_2 from './sendReviewInvitesRightTime_v2'
import SendReviewInvitesForPreviousOrders_2 from './sendReviewInvitesForPreviousOrders_v2'
import { TabProps } from '@/modules/type'

const ReviewInvitesTab_v2: FC<TabProps> = ({ phrasesByKey }) => {
  const [isToggle, setIsToggle] = useState(true)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const { selectedShopChannels } = useStore(selectorChannels)
  const { changeNumberOfDays, onExport_v2, saveChangeUseTimeOfSendReviewInvites_v2 } = useStore()
  const { numberOfDays, isLoading } = useStore(selectorReviewInvites)

  const saveChanges = async () => {
    await saveChangeUseTimeOfSendReviewInvites_v2()
  }

  return (
    <div className="ts-w-full ts-flex ts-flex-col ts-gap-8">
      {isLoading && <ScrinSpinner />}

      {(infoOfSystem.allowsEstimatedDeliveryDate || infoOfSystem.allowsEventsByOrderStatus) && (
        <SendReviewInvitesRightTime_2
          phrasesByKey={phrasesByKey}
          saveChanges={saveChanges}
          selectedShopChannels={selectedShopChannels}
        />
      )}

      {infoOfSystem.allowsSendReviewInvitesForPreviousOrders && (
        <SendReviewInvitesForPreviousOrders_2
          phrasesByKey={phrasesByKey}
          selectedShopChannels={selectedShopChannels}
          numberOfDays={numberOfDays}
          changeNumberOfDays={changeNumberOfDays}
          onExport={onExport_v2}
          isToggle={isToggle}
          handleToggle={() => setIsToggle(prev => !prev)}
        />
      )}
    </div>
  )
}

export default ReviewInvitesTab_v2
