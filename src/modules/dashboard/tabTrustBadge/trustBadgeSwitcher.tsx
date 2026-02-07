import { h } from 'preact'
import { FC } from 'preact/compat'
import { selectorTrustbadgeState } from '@/store/selector'
import { DASHBOARD_KEYS } from '@/locales/types'
import useStore from '@/store/useStore'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  handleSwitch: any
}

const TrustBadgeSwitcher: FC<Props> = ({ phrasesByKey, handleSwitch }) => {
  const { trustbadgeId, trustbadgeDataChild } = useStore(selectorTrustbadgeState)

  const isActive =
    trustbadgeDataChild.attributes &&
    trustbadgeDataChild.attributes['data-disable-trustbadge']
      ? (!trustbadgeDataChild.attributes['data-disable-trustbadge'].value as boolean)
      : false

  return (
    <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-8">
      <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
        {phrasesByKey.application_trustbadge_titel}
      </h2>
      <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280' }}>
        Display your Trusted Shops certification with the Trustbadge widget. Show your star rating, Buyer Protection, and build trust with your customers directly on your shop pages.
      </p>

      {/* Divider */}
      <div className="ts-w-full ts-my-6" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

      {/* Toggle switch */}
      <div className="ts-flex ts-items-center ts-gap-3">
        <button
          id="switch_button_trustBadge"
          type="button"
          onClick={() => {
            if (!trustbadgeId) return
            handleSwitch()
          }}
          className="ts-border-0 ts-p-0 ts-cursor-pointer ts-flex-shrink-0"
          style={{
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: isActive ? '#16A34A' : '#D1D5DB',
            position: 'relative',
            transition: 'background-color 0.2s ease',
            opacity: !trustbadgeId ? 0.25 : 1,
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              position: 'absolute',
              top: '2px',
              left: isActive ? '22px' : '2px',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
          />
        </button>
        <span
          id="switch_label_trustBadge"
          className="ts-text-sm ts-font-normal"
          style={{ color: isActive ? '#111827' : '#6B7280' }}
        >
          {isActive ? 'Active on website' : 'Inactive'}
        </span>
      </div>
    </div>
  )
}

export default TrustBadgeSwitcher
