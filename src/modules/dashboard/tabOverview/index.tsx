import { h } from 'preact'
import { FC } from 'preact/compat'
import { TabProps } from '@/modules/type'
import useStore from '@/store/useStore'
import { selectorInfoOfSystem, selectorTrstdLogin, selectorTrustbadgeState } from '@/store/selector'
import TrstdLoginOverview from '@/assets/trstd-login-overview.svg'
import TrustbadgeOverview from '@/assets/trustbadge-overview.svg'
import WidgetsOverview from '@/assets/widgets-overview.svg'
import ReviewInvitesOverview from '@/assets/review-invites-overview.svg'
import StyledButton from '@/components/controls/styledButton'
import TextWithLink from '@/components/layouts/textWithLink'
import { HelpCircleIcon } from '@/components/layouts/icons/HelpCircleIcon'
import { ExternalLinkIcon } from '@/components/layouts/icons/ExternalLinkIcon'

interface OverviewTabProps extends TabProps {
  onNavigateToTab: (tabId: number) => void
}

const OverviewTab: FC<OverviewTabProps> = ({ phrasesByKey, onNavigateToTab }) => {
  const { trustbadgeDataChild } = useStore(selectorTrustbadgeState)
  const { trstdLoginData } = useStore(selectorTrstdLogin)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const { allowsSupportTrstdLogin } = infoOfSystem

  const isTrstdLoginActive = trstdLoginData?.configuration?.integration?.trstdLoginEnabled ?? false

  const isTrustbadgeActive =
    trustbadgeDataChild.attributes &&
    trustbadgeDataChild.attributes['data-disable-trustbadge']
      ? (!trustbadgeDataChild.attributes['data-disable-trustbadge'].value as boolean)
      : false

  const featureCards = [
    ...(allowsSupportTrstdLogin ? [{
      id: 'trstd-login',
      tabId: 1,
      title: phrasesByKey.overview_trstd_login_title,
      description: phrasesByKey.overview_trstd_login_description,
      illustration: TrstdLoginOverview,
      hasStatus: true,
      isActive: isTrstdLoginActive,
      statusLabel: phrasesByKey.overview_trstd_login_status_enabled,
      buttonLabel: phrasesByKey.overview_trstd_login_button_configure,
    }] : []),
    {
      id: 'trustbadge',
      tabId: 2,
      title: phrasesByKey.overview_trustbadge_title,
      description: phrasesByKey.overview_trustbadge_description,
      illustration: TrustbadgeOverview,
      hasStatus: true,
      statusLabel: isTrustbadgeActive ? phrasesByKey.overview_trustbadge_status_enabled : phrasesByKey.overview_trustbadge_status_inactive,
      isActive: isTrustbadgeActive,
      buttonLabel: phrasesByKey.overview_trustbadge_button_configure,
    },
    {
      id: 'widgets',
      tabId: 3,
      title: phrasesByKey.overview_widgets_title,
      description: phrasesByKey.overview_widgets_description,
      illustration: WidgetsOverview,
      buttonLabel: phrasesByKey.overview_widgets_button_manage,
    },
    {
      id: 'review-invites',
      tabId: 4,
      title: phrasesByKey.overview_invites_title,
      description: phrasesByKey.overview_invites_description,
      illustration: ReviewInvitesOverview,
      buttonLabel: phrasesByKey.overview_invites_button_manage,
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
            className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-flex ts-flex-col sm:ts-flex-row"
            style={{
              overflow: 'hidden',
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
        <TextWithLink
          id="overview_help"
          text={phrasesByKey.overview_help_text}
          url={phrasesByKey.overview_help_url}
          textStyle="ts-text-sm ts-font-normal ts-m-0 ts-text-[#374151]"
          linkStyle="ts-inline-flex ts-items-center ts-gap-1 ts-underline !ts-text-[#155DFC]"
          linkSuffix={<ExternalLinkIcon />}
        />
      </div>
    </div>
  )
}

export default OverviewTab
