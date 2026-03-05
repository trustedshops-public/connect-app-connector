import { h } from 'preact'
import { FC, useState } from 'preact/compat'
import { ScrinSpinner } from '@/components/layouts/spinner'
import {
  selectAllState,
  selectorAuth,
  selectorChannels,
  selectorInfoOfSystem,
  selectorReviewInvites,
} from '@/store/selector'
import useStore from '@/store/useStore'
import SendReviewInvitesRightTime_2 from './sendReviewInvitesRightTime_v2'
import SendReviewInvitesForPreviousOrders_2 from './sendReviewInvitesForPreviousOrders_v2'
import { TabProps } from '@/modules/type'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'

const ReviewInvitesTab_v2: FC<TabProps> = ({ phrasesByKey }) => {
  const [isToggle, setIsToggle] = useState(true)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const { selectedShopChannels } = useStore(selectorChannels)
  const { changeNumberOfDays, onExport_v2, saveChangeUseTimeOfSendReviewInvites_v2 } = useStore()
  const { numberOfDays, isLoading } = useStore(selectorReviewInvites)
  const allState = useStore(selectAllState)
  const { user } = useStore(selectorAuth)
  const saveChanges = async () => {
    await saveChangeUseTimeOfSendReviewInvites_v2()
    handleEtrustedConfiguration(user?.access_token, allState, 'invites', putEtrustedConfiguration)
  }

  return (
    <div className="ts-w-full ts-flex ts-flex-col ts-gap-6">
      {isLoading && <ScrinSpinner />}

      <div className="ts-pb-2">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          Review invites
        </h2>
        <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280', maxWidth: '75%' }}>
          Send review invites to your customers at the right time to collect more reviews and improve the quality of your customer feedback.
        </p>
      </div>

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
