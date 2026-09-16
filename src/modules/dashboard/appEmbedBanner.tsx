import { ComponentChildren, h } from 'preact'
import { FC } from 'preact/compat'
import { DASHBOARD_KEYS } from '@/locales/types'
import { InfoCircleOutlinedIcon } from '@/components/layouts/icons/InfoCircleOutlinedIcon'
import { ChevronRightSmallIcon } from '@/components/layouts/icons/ChevronRightSmallIcon'

type Variant = 'warning' | 'info'

const COLORS: Record<
  Variant,
  { background: string; border: string; iconBackground: string; iconColor: string }
> = {
  warning: {
    background: '#FFFAEB',
    border: '#FEDF89',
    iconBackground: '#FEF0C7',
    iconColor: '#DC6803',
  },
  info: {
    background: '#EFF8FF',
    border: '#B2DDFF',
    iconBackground: '#D1E9FF',
    iconColor: '#1570EF',
  },
}

const Banner: FC<{
  variant: Variant
  title: string
  text: string
  /** Rendered below the text, inside the text column (e.g. a help link). */
  footer?: ComponentChildren
  /** Rendered on the trailing edge of the banner (e.g. a call to action button). */
  action?: ComponentChildren
}> = ({ variant, title, text, footer, action }) => {
  const colors = COLORS[variant]

  // ts-relative lifts the banner above the content area that follows it: that area's
  // opaque background paints later in document order and would clip the shadow's bottom.
  return (
    <div className="ts-max-w-backgroundCard ts-mx-auto ts-w-full ts-px-4 sm:ts-px-8 ts-pt-6 ts-relative">
      <div
        className="ts-flex ts-flex-wrap ts-items-center ts-gap-4 ts-rounded-[12px] ts-shadow-md"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          padding: '16px 20px',
        }}
      >
        <div
          className="ts-flex-shrink-0 ts-flex ts-items-center ts-justify-center ts-rounded-[12px]"
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: colors.iconBackground,
            color: colors.iconColor,
          }}
        >
          <InfoCircleOutlinedIcon size={20} />
        </div>
        <div className="ts-flex-1" style={{ minWidth: '260px' }}>
          <p
            className="ts-text-sm ts-font-bold ts-m-0"
            style={{ color: '#101828', lineHeight: '20px' }}
          >
            {title}
          </p>
          <p
            className="ts-text-sm ts-font-normal ts-m-0"
            style={{ color: '#101828', lineHeight: '20px' }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
          {footer}
        </div>
        {action}
      </div>
    </div>
  )
}

/** Shown while the app embed still has to be turned on in the theme editor. */
export const AppEmbedActivationBanner: FC<{
  phrasesByKey: DASHBOARD_KEYS
  deepLink: string
}> = ({ phrasesByKey, deepLink }) => (
  <Banner
    variant="warning"
    title={phrasesByKey.shopify_app_embed_banner_title}
    text={phrasesByKey.shopify_app_embed_banner_text}
    action={
      <a
        id="link_appEmbedDeepLink"
        data-testid="link_appEmbedDeepLink"
        href={deepLink}
        target="_blank"
        rel="noreferrer"
        className="ts-text-sm ts-rounded-[10px] ts-no-underline ts-whitespace-nowrap ts-flex-shrink-0 ts-cursor-pointer hover:ts-brightness-95 active:ts-scale-[0.97] active:ts-brightness-90"
        style={{
          fontSize: '14px',
          fontWeight: '600',
          backgroundColor: '#FEDF89',
          color: '#93370D',
          padding: '10px 18px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
          transition: 'transform 0.1s ease, filter 0.1s ease',
        }}
      >
        {phrasesByKey.shopify_app_embed_banner_button}
      </a>
    }
  />
)

/** Shown once the app embed is detected as turned on, to keep it that way across markets. */
export const AppEmbedActiveBanner: FC<{ phrasesByKey: DASHBOARD_KEYS }> = ({ phrasesByKey }) => (
  <Banner
    variant="info"
    title={phrasesByKey.shopify_app_embed_active_banner_title}
    text={phrasesByKey.shopify_app_embed_active_banner_text}
    footer={
      <a
        id="link_appEmbedHelp"
        data-testid="link_appEmbedHelp"
        href={phrasesByKey.shopify_app_embed_active_banner_link_url}
        target="_blank"
        rel="noreferrer"
        className="ts-text-sm ts-no-underline ts-inline-flex ts-items-center ts-gap-1 ts-mt-1 ts-cursor-pointer hover:ts-underline active:ts-brightness-90"
        style={{
          color: '#2563EB',
          fontWeight: '500',
          lineHeight: '20px',
          transition: 'filter 0.1s ease',
        }}
      >
        {phrasesByKey.shopify_app_embed_active_banner_link_text}
        <ChevronRightSmallIcon />
      </a>
    }
  />
)
