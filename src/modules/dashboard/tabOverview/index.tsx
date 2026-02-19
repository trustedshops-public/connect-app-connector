import { h } from 'preact'
import { FC } from 'preact/compat'
import { TabProps } from '@/modules/type'
import useStore from '@/store/useStore'
import { selectorTrustbadgeState } from '@/store/selector'
import TrstdLoginOverview from '@/assets/trstd-login-overview.svg'
import TrustbadgeOverview from '@/assets/trustbadge-overview.svg'
import WidgetsOverview from '@/assets/widgets-overview.svg'
import ReviewInvitesOverview from '@/assets/review-invites-overview.svg'
import { ActiveStatusIcon } from '@/components/layouts/icons/ActiveStatusIcon'
import { HelpCircleIcon } from '@/components/layouts/icons/HelpCircleIcon'
import { ExternalLinkIcon } from '@/components/layouts/icons/ExternalLinkIcon'

interface OverviewTabProps extends TabProps {
  onNavigateToTab: (tabId: number) => void
}

const OverviewTab: FC<OverviewTabProps> = ({ phrasesByKey, onNavigateToTab }) => {
  const { trustbadgeDataChild } = useStore(selectorTrustbadgeState)

  const isTrustbadgeActive =
    trustbadgeDataChild.attributes &&
    trustbadgeDataChild.attributes['data-disable-trustbadge']
      ? (!trustbadgeDataChild.attributes['data-disable-trustbadge'].value as boolean)
      : false

  const featureCards = [
    {
      id: 'trstd-login',
      tabId: 1,
      title: '#trstd login',
      description:
        'Lorem ipsum dolor sit amet consectetur. Sociis vestibulum dui eros nec sed ipsum et pellentesque. Pulvinar dolor bibendum arcu ut erat ac viverra donec.',
      illustration: TrstdLoginOverview,
      isActive: false,
      buttonLabel: 'Configure',
      buttonVariant: 'outlined' as const,
    },
    {
      id: 'trustbadge',
      tabId: 2,
      title: 'Trustbadge',
      description:
        'Lorem ipsum dolor sit amet consectetur. Sociis vestibulum dui eros nec sed ipsum et pellentesque. Pulvinar dolor bibendum arcu ut erat ac viverra donec.',
      illustration: TrustbadgeOverview,
      isActive: isTrustbadgeActive,
      buttonLabel: 'Configure',
      buttonVariant: 'outlined' as const,
    },
    {
      id: 'widgets',
      tabId: 3,
      title: 'Widgets',
      description:
        'Lorem ipsum dolor sit amet consectetur. Sociis vestibulum dui eros nec sed ipsum et pellentesque. Pulvinar dolor bibendum arcu ut erat ac viverra donec.',
      illustration: WidgetsOverview,
      buttonLabel: 'Manage',
      buttonVariant: 'filled' as const,
    },
    {
      id: 'review-invites',
      tabId: 4,
      title: 'Review Invites',
      description:
        'Lorem ipsum dolor sit amet consectetur. Sociis vestibulum dui eros nec sed ipsum et pellentesque. Pulvinar dolor bibendum arcu ut erat ac viverra donec.',
      illustration: ReviewInvitesOverview,
      buttonLabel: 'Manage',
      buttonVariant: 'filled' as const,
    },
  ]

  return (
    <div className="ts-flex ts-flex-col ts-gap-6">
      {/* Feature cards grid - 2 columns on desktop, 1 on mobile */}
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
            className="ts-bg-white ts-rounded-[16px] ts-flex ts-flex-col sm:ts-flex-row"
            style={{
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
            }}
          >
            {/* Illustration - left side on desktop, top on mobile */}
            <div
              className="ts-flex ts-items-center ts-justify-center ts-flex-shrink-0"
              style={{
                padding: '3px',
                alignSelf: 'stretch',
              }}
            >
              <img
                src={card.illustration}
                alt={card.title}
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            {/* Content - right side */}
            <div className="ts-p-5 ts-flex-1 ts-flex ts-flex-col">
              <div className="ts-flex ts-items-start ts-justify-between ts-mb-2">
                <h3
                  className="ts-text-default ts-font-bold"
                  style={{ fontSize: '15px', lineHeight: '22px' }}
                >
                  {card.title}
                </h3>
                {'isActive' in card && (
                  <div
                    className="ts-flex ts-items-center ts-gap-1.5 ts-flex-shrink-0 ts-ml-2"
                    style={{
                      backgroundColor: card.isActive ? '#E0FAF0' : '#F3F4F6',
                      borderRadius: '33554400px',
                      padding: '4px 10px',
                    }}
                  >
                    {card.isActive && <ActiveStatusIcon />}
                    <span
                      style={{
                        color: card.isActive ? '#106446' : '#6B7280',
                        fontSize: '13px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '19.5px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {card.isActive ? 'Active on website' : 'Inactive'}
                    </span>
                  </div>
                )}
              </div>

              <p
                className="ts-text-sm ts-font-normal ts-mb-4"
                style={{ color: '#6b7280', lineHeight: '20px' }}
              >
                {card.description}
              </p>

              <div className="ts-mt-auto">
                <button
                  type="button"
                  onClick={() => onNavigateToTab(card.tabId)}
                  className="ts-text-sm ts-font-bold ts-cursor-pointer ts-border-0"
                  style={
                    card.buttonVariant === 'filled'
                      ? {
                          color: '#FFFFFF',
                          background: 'linear-gradient(180deg, #1c8dc6 0%, #005aa0 100%)',
                          borderRadius: '4px',
                          padding: '8px 24px',
                          height: '36px',
                        }
                      : {
                          color: '#005aa0',
                          background: 'linear-gradient(180deg, #F7F7F7 0%, #F5F5F5 9%, #E8E8E8 100%)',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          padding: '8px 24px',
                          height: '36px',
                        }
                  }
                >
                  {card.buttonLabel}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive grid style */}
      <style>{`
        @media (max-width: 639px) {
          .overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Need help card */}
      <div
        className="ts-rounded-[16px] ts-p-6 sm:ts-p-8"
        style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
          border: '1px solid #E5E7EB',
        }}
      >
        <div className="ts-flex ts-items-start ts-gap-4">
          <div className="ts-flex-shrink-0">
            <HelpCircleIcon />
          </div>
          <div>
            <p className="ts-text-default ts-text-sm ts-font-bold ts-mb-1">
              Need help with setup or configuration?
            </p>
            <p className="ts-text-sm ts-font-normal ts-mb-3" style={{ color: '#6b7280' }}>
              Learn how to connect and configure your Trusted Shops products step by step.
            </p>
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
      </div>
    </div>
  )
}

export default OverviewTab
