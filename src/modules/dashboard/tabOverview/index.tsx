import { h } from 'preact'
import { FC } from 'preact/compat'
import { TabProps } from '@/modules/type'
import useStore from '@/store/useStore'
import { selectorInfoOfSystem, selectorTrustbadgeState } from '@/store/selector'
import TrstdLoginOverview from '@/assets/trstd-login-overview.svg'
import TrustbadgeOverview from '@/assets/trustbadge-overview.svg'
import WidgetsOverview from '@/assets/widgets-overview.svg'
import ReviewInvitesOverview from '@/assets/review-invites-overview.svg'
import StyledButton from '@/components/controls/styledButton'
import { HelpCircleIcon } from '@/components/layouts/icons/HelpCircleIcon'
import { ExternalLinkIcon } from '@/components/layouts/icons/ExternalLinkIcon'

interface OverviewTabProps extends TabProps {
  onNavigateToTab: (tabId: number) => void
}

const OverviewTab: FC<OverviewTabProps> = ({ phrasesByKey, onNavigateToTab }) => {
  const { trustbadgeDataChild } = useStore(selectorTrustbadgeState)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const { allowsSupportTrstdLogin } = infoOfSystem

  const isTrustbadgeActive =
    trustbadgeDataChild.attributes &&
    trustbadgeDataChild.attributes['data-disable-trustbadge']
      ? (!trustbadgeDataChild.attributes['data-disable-trustbadge'].value as boolean)
      : false

  const featureCards = [
    ...(allowsSupportTrstdLogin ? [{
      id: 'trstd-login',
      tabId: 1,
      title: '#trstd login',
      description:
        'Protects your visitors from fakes. Once activated, the personal #trstd secret is displayed, proving that the site is authentic. Fake websites can\'t do this. A strong signal that also protects you from brand misuse.',
      illustration: TrstdLoginOverview,
      hasStatus: true,
      statusLabel: 'Enabled \u00b7 Auto placement',
      buttonLabel: 'Configure',
    }] : []),
    {
      id: 'trustbadge',
      tabId: 2,
      title: 'Trustbadge',
      description:
        'Builds trust at first glance through the Trusted Shops brand. Displays your rating based on real orders and, if awarded, the Trusted Shops Trustmark with Buyer Protection across all payment methods.',
      illustration: TrustbadgeOverview,
      hasStatus: true,
      statusLabel: isTrustbadgeActive ? 'Enabled \u00b7 Auto placement' : 'Inactive',
      isActive: isTrustbadgeActive,
      buttonLabel: 'Configure',
    },
    {
      id: 'widgets',
      tabId: 3,
      title: 'Widgets',
      description:
        'Show off what your customers say about your business. Choose how you want to display reviews and other trust elements across your website to attract new customers and boost sales.',
      illustration: WidgetsOverview,
      buttonLabel: 'Manage',
    },
    {
      id: 'review-invites',
      tabId: 4,
      title: 'Review Invites',
      description:
        'Get more reviews by inviting your customers to leave a review after they\'ve made a purchase. You can set up review invites in the Trusted Shops Control Centre.',
      illustration: ReviewInvitesOverview,
      buttonLabel: 'Manage',
    },
  ]

  return (
    <div className="ts-flex ts-flex-col ts-gap-6">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
        }}
        className="overview-grid"
      >
        {featureCards.map(card => (
          <div
            key={card.id}
            className="ts-bg-white ts-rounded-[14px] ts-flex ts-flex-col sm:ts-flex-row"
            style={{
              overflow: 'hidden',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div
              style={{
                backgroundColor: '#E6EDFE',
                width: '180px',
                minHeight: '160px',
                borderRadius: '14px 0 0 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: '12px',
              }}
            >
              <img
                src={card.illustration}
                alt={card.title}
                style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain' }}
              />
            </div>

            <div className="ts-p-5 ts-flex-1 ts-flex ts-flex-col">
              <div className="ts-flex ts-items-start ts-justify-between ts-mb-2">
                <h3
                  className="ts-text-default ts-font-bold"
                  style={{ fontSize: '15px', lineHeight: '22px' }}
                >
                  {card.title}
                </h3>
                {'hasStatus' in card && (
                  <div
                    className="ts-flex ts-items-center ts-gap-1.5 ts-flex-shrink-0 ts-ml-2"
                    style={{
                      backgroundColor: ('isActive' in card && !card.isActive) ? '#F3F4F6' : '#E0FAF0',
                      borderRadius: '9999px',
                      padding: '3px 10px',
                    }}
                  >
                    <span
                      style={{
                        color: ('isActive' in card && !card.isActive) ? '#6B7280' : '#106446',
                        fontSize: '10px',
                        fontWeight: 600,
                        lineHeight: '14px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {card.statusLabel}
                    </span>
                  </div>
                )}
              </div>

              <p
                className="ts-text-xs ts-font-normal ts-mb-4"
                style={{ color: '#6b7280', lineHeight: '18px' }}
              >
                {card.description}
              </p>

              <div className="ts-mt-auto">
                <StyledButton
                  variant="primary"
                  onClick={() => onNavigateToTab(card.tabId)}
                >
                  {card.buttonLabel}
                </StyledButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 639px) {
          .overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="ts-flex ts-items-center ts-gap-2 ts-py-3">
        <HelpCircleIcon customClass="ts-text-[#155DFC] ts-flex-shrink-0" />
        <span className="ts-text-sm ts-font-normal" style={{ color: '#374151' }}>
          Need help with setup or configuration?
        </span>
        <a
          href={phrasesByKey.global_help_link_url_1}
          className="ts-text-sm ts-font-normal ts-inline-flex ts-items-center ts-gap-1"
          style={{ color: '#2563EB' }}
          target="_blank"
          rel="noreferrer"
        >
          Open integration guide
          <ExternalLinkIcon />
        </a>
      </div>
    </div>
  )
}

export default OverviewTab
