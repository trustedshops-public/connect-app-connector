import { h, Fragment } from 'preact'
import { FC } from 'preact/compat'
import { ChevronRightSmallIcon } from '@/components/layouts/icons/ChevronRightSmallIcon'
import { InfoCircleOutlinedIcon } from '@/components/layouts/icons/InfoCircleOutlinedIcon'
import NewFeatureBadge from '@/components/controls/newFeatureBadge'
import { selectorStructuredMarkup } from '@/store/selector'
import { DASHBOARD_KEYS } from '@/locales/types'
import useStore from '@/store/useStore'

// The "New feature" badge hides itself automatically after this date
const NEW_FEATURE_BADGE_VISIBLE_UNTIL = new Date('2026-09-15')

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  isTrustbadgeDisabled: boolean
}

const StructuredMarkupSection: FC<Props> = ({ phrasesByKey, isTrustbadgeDisabled }) => {
  const { updateStructuredMarkupEnabled } = useStore()
  const { structuredMarkupEnabled, isLoadingStructuredMarkup } = useStore(selectorStructuredMarkup)

  const isSwitchBlocked =
    isLoadingStructuredMarkup || (isTrustbadgeDisabled && !structuredMarkupEnabled)

  const handleSwitch = () => {
    if (isSwitchBlocked) return
    updateStructuredMarkupEnabled(!structuredMarkupEnabled)
  }

  const scrollToTrustbadgeToggle = () => {
    document
      .getElementById('switch_button_trustBadge')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const [hintBefore, hintLink, hintAfter] = (
    phrasesByKey.application_trustbadge_structuredMarkup_hint_title || ''
  ).split('[%s]')

  // One sentence per line, as in the design
  const descriptionSentences = (
    phrasesByKey.application_trustbadge_structuredMarkup_description || ''
  )
    .split('. ')
    .map(sentence => sentence.trim())
    .filter(Boolean)
    .map((sentence, index, all) => (index < all.length - 1 ? `${sentence}.` : sentence))

  return (
    <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-6">
      <div className="ts-flex ts-items-center ts-justify-between ts-gap-3 ts-mb-2">
        <div className="ts-flex ts-items-center ts-gap-2">
          <h2
            style={{
              color: '#101828',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '28px',
            }}
          >
            {phrasesByKey.application_trustbadge_structuredMarkup_title}
          </h2>
          <NewFeatureBadge
            id="badge_structuredMarkupNewFeature"
            label={phrasesByKey.application_trustbadge_structuredMarkup_newFeature}
            visibleUntil={NEW_FEATURE_BADGE_VISIBLE_UNTIL}
          />
        </div>
        <button
          id="switch_button_structuredMarkup"
          type="button"
          onClick={handleSwitch}
          className="ts-border-0 ts-p-0 ts-flex-shrink-0"
          style={{
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: structuredMarkupEnabled ? '#16A34A' : '#D1D5DB',
            position: 'relative',
            transition: 'background-color 0.2s ease',
            opacity: isSwitchBlocked ? 0.25 : 1,
            cursor: isSwitchBlocked ? 'not-allowed' : 'pointer',
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
              left: structuredMarkupEnabled ? '22px' : '2px',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
          />
        </button>
      </div>
      <p
        className="ts-mb-4"
        style={{
          color: '#4A5565',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '22.75px',
          letterSpacing: '-0.15px',
        }}
      >
        {descriptionSentences.map(sentence => (
          <span key={sentence} className="ts-block">
            {sentence}
          </span>
        ))}
      </p>

      <a
        id="link_structuredMarkupLearnMore"
        href={phrasesByKey.application_trustbadge_structuredMarkup_learnMore_url}
        target="_blank"
        rel="noreferrer"
        className="ts-text-sm ts-font-normal ts-inline-flex ts-items-center ts-gap-1"
        style={{ color: '#2563EB' }}
      >
        {phrasesByKey.application_trustbadge_structuredMarkup_learnMore}
        <ChevronRightSmallIcon />
      </a>

      {isTrustbadgeDisabled && (
        <div
          id="hint_structuredMarkupTrustbadgeDisabled"
          className="ts-flex ts-items-center ts-gap-4 ts-mt-6"
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '20px 24px',
          }}
        >
          <div
            className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
            }}
          >
            <InfoCircleOutlinedIcon size={20} />
          </div>
          <p
            style={{
              color: '#101828',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '20px',
              letterSpacing: '-0.15px',
            }}
          >
            {hintBefore}
            {hintLink && (
              <Fragment>
                <button
                  type="button"
                  onClick={scrollToTrustbadgeToggle}
                  className="ts-border-0 ts-p-0 ts-bg-transparent ts-cursor-pointer ts-underline"
                  style={{
                    color: 'inherit',
                    font: 'inherit',
                    letterSpacing: 'inherit',
                  }}
                >
                  {hintLink}
                </button>
                {hintAfter}
              </Fragment>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default StructuredMarkupSection
