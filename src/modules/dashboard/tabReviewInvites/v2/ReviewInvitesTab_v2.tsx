import { h } from 'preact'
import { ArrowRightLineIcon } from '@/components/layouts/icons/ArrowRightLineIcon'
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

      {/* Header - no card */}
      <div className="ts-pb-2">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          Review Invites
        </h2>
        <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280', maxWidth: '75%' }}>
          Configure when and how your customers receive review invitations to maximize feedback and build trust.
        </p>
      </div>

      {(infoOfSystem.allowsEstimatedDeliveryDate || infoOfSystem.allowsEventsByOrderStatus) && (
        <SendReviewInvitesRightTime_2
          phrasesByKey={phrasesByKey}
          saveChanges={saveChanges}
          selectedShopChannels={selectedShopChannels}
        />
      )}

      {/* Upgrade Available card */}
      {infoOfSystem.allowsSendReviewInvitesForProduct && (
        <div
        className="ts-shadow-md"
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
            border: '1px solid #BEDBFF',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <span
            style={{
              color: '#1447E6',
              backgroundColor: '#DBEAFE',
              borderRadius: '16px',
              padding: '8px 16px',
              height: '32px',
              display: 'inline-block',
              marginBottom: '12px',
              fontSize: '12px',
              fontWeight: '500',
              lineHeight: '16px',
              letterSpacing: '0.03em',
            }}
          >
            Upgrade Available
          </span>
          <h3 className="ts-text-default ts-font-bold ts-mb-2" style={{ fontSize: '15px' }}>
            Unlock Product Reviews & Boost Your Sales
          </h3>
          <p className="ts-text-sm ts-font-normal ts-mb-4" style={{ color: '#6b7280', maxWidth: '60%' }}>
            Collect authentic product reviews and increase conversion rates. Show customers what they need to know before making a purchase decision.
          </p>
          <a
            href="https://www.trustedshops.com/tsb2b/sa/upgradeCenter.seam"
            target="_blank"
            rel="noopener noreferrer"
            className="ts-inline-flex ts-items-center ts-gap-2 ts-text-sm ts-font-medium"
            style={{
              color: '#005AA0',
              border: '1px solid #CCC',
              borderRadius: '4px',
              padding: '8px 16px',
              textDecoration: 'none',   
              background: 'linear-gradient(180deg, #F7F7F7 0%, #F5F5F5 8.85%, #E8E8E8 100%)',
            }}
          >
            Contact Sales Team
            <ArrowRightLineIcon />
          </a>
        </div>
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
