import { ComponentChildren, h } from 'preact'
import { FC } from 'preact/compat'
import StyledButton from '@/components/controls/styledButton'
import Callout, { CalloutTone } from '@/components/layouts/callout'
import TrustedE from '@/assets/connect/trusted-e.svg'
import Spinner from '@/assets/connect/spinner.svg'

// The cards of the connect page ("Connect with Trusted Shops"): start, waiting
// for the Control Centre window, finishing, and the start again after a
// failure or with a notice. The manual form lives in index.tsx.

const CARD_SHADOW = '0px 4px 8px -2px rgba(0,0,0,0.12), 0px 1px 4px -1px rgba(0,0,0,0.1)'

export const PluginCard: FC<{
  id: string
  children: ComponentChildren
  radius?: number
}> = ({ id, children, radius = 12 }) => (
  <div
    id={id}
    data-testid={id}
    className="ts-bg-white ts-border ts-border-solid ts-border-[#EAECF0] ts-flex ts-flex-col ts-items-center ts-gap-6 ts-w-full ts-px-6 ts-py-8 sm:ts-p-12"
    style={{ maxWidth: '560px', borderRadius: `${radius}px`, boxShadow: CARD_SHADOW }}
  >
    {children}
  </div>
)

const LogoTile: FC = () => (
  <div
    className="ts-flex ts-items-center ts-justify-center ts-bg-white ts-border ts-border-solid ts-border-[#EAECF0] ts-rounded-[12px] ts-flex-shrink-0"
    style={{ width: '64px', height: '64px' }}
  >
    <img src={TrustedE} alt="" width={36} height={36} />
  </div>
)

const TitleBlock: FC<{ title: string; text?: string }> = ({ title, text }) => (
  <div
    className="ts-flex ts-flex-col ts-gap-2 ts-w-full ts-text-center"
    style={{ letterSpacing: '0.15px' }}
  >
    <h1
      className="ts-font-semibold"
      style={{ fontSize: '24px', lineHeight: '32px', color: '#101828' }}
    >
      {title}
    </h1>
    {text && (
      <p
        className="ts-font-normal"
        style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}
      >
        {text}
      </p>
    )}
  </div>
)

// "Can't allow pop-ups? Enter credentials manually": the manual path, offered
// only once one-click connect didn't work.
const ManualHint: FC<{ hint: string; label: string; onManual: () => void }> = ({
  hint,
  label,
  onManual,
}) => (
  <div className="ts-flex ts-flex-wrap ts-items-center ts-justify-center ts-gap-1 ts-w-full">
    <p
      className="ts-font-normal"
      style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}
    >
      {hint}
    </p>
    <button
      id="button_showManualForm"
      type="button"
      onClick={onManual}
      className="ts-text-sm ts-font-bold ts-cursor-pointer ts-underline"
      style={{ color: '#024DF0' }}
    >
      {label}
    </button>
  </div>
)

export interface ConnectCardNotice {
  tone: CalloutTone
  title: string
  text: string
  // With a hint, the card offers "Try again" and the manual path.
  hint?: string
}

export const ConnectCard: FC<{
  title: string
  text: string
  buttonLabel: string
  retryLabel: string
  manualLabel: string
  notice: Nullable<ConnectCardNotice>
  onConnect: () => void
  onManual: () => void
}> = ({ title, text, buttonLabel, retryLabel, manualLabel, notice, onConnect, onManual }) => (
  <PluginCard id="connectCard">
    <LogoTile />
    <TitleBlock title={title} text={notice ? undefined : text} />
    {notice && (
      <Callout id="connectNotice" tone={notice.tone} title={notice.title} withIconTile>
        {notice.text}
      </Callout>
    )}
    <StyledButton
      id="connectWithTrustedShops"
      variant="primary"
      fullWidth
      height={46}
      onClick={onConnect}
    >
      {notice?.hint ? retryLabel : buttonLabel}
    </StyledButton>
    {notice?.hint && <ManualHint hint={notice.hint} label={manualLabel} onManual={onManual} />}
  </PluginCard>
)

export const WaitingCard: FC<{
  title: string
  text: string
  windowNotShowing: string
  openWindowLabel: string
  manualLabel: string
  onOpenWindow: () => void
  onManual: () => void
}> = ({ title, text, windowNotShowing, openWindowLabel, manualLabel, onOpenWindow, onManual }) => (
  <PluginCard id="connectWaiting" radius={24}>
    <style>{`
      @keyframes tsConnectProgress { from { left: -160px } to { left: 100% } }
      #connectProgressBar { animation: tsConnectProgress 1.6s ease-in-out infinite }
      @media (prefers-reduced-motion: reduce) { #connectProgressBar { animation: none; left: 0 } }
    `}</style>
    <div
      role="progressbar"
      aria-label={title}
      className="ts-relative ts-w-full ts-overflow-hidden ts-rounded-full"
      style={{ height: '4px', backgroundColor: '#E5F4FF' }}
    >
      <div
        id="connectProgressBar"
        className="ts-absolute ts-top-0 ts-rounded-full"
        style={{ height: '4px', width: '160px', backgroundColor: '#005AA0' }}
      />
    </div>
    <div
      role="status"
      className="ts-flex ts-flex-col ts-gap-2 ts-w-full ts-text-center"
      style={{ letterSpacing: '0.15px' }}
    >
      <h1
        className="ts-font-semibold"
        style={{ fontSize: '24px', lineHeight: 1.6, color: 'rgba(0,0,0,0.87)' }}
      >
        {title}
      </h1>
      <p
        className="ts-font-normal"
        style={{ fontSize: '16px', lineHeight: 1.5, color: 'rgba(0,0,0,0.6)' }}
      >
        {text}
      </p>
    </div>
    <div className="ts-w-full" style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.12)' }} />
    <p
      className="ts-font-medium ts-w-full ts-text-center"
      style={{
        fontSize: '14px',
        lineHeight: 1.57,
        letterSpacing: '0.1px',
        color: 'rgba(0,0,0,0.87)',
      }}
    >
      {windowNotShowing}
    </p>
    <div className="ts-flex ts-flex-col sm:ts-flex-row ts-items-center ts-justify-center ts-gap-4 ts-w-full">
      <StyledButton
        id="openConnectWindow"
        variant="primary"
        flex1
        fullWidth
        height={46}
        onClick={onOpenWindow}
      >
        {openWindowLabel}
      </StyledButton>
      <button
        id="button_showManualForm"
        type="button"
        onClick={onManual}
        className="ts-flex-1 ts-w-full ts-text-sm ts-font-bold ts-cursor-pointer ts-underline"
        style={{ color: '#024DF0' }}
      >
        {manualLabel}
      </button>
    </div>
  </PluginCard>
)

export const FinishingCard: FC<{ title: string; text: string }> = ({ title, text }) => (
  <PluginCard id="connectFinishing">
    <LogoTile />
    <div role="status" className="ts-w-full">
      <TitleBlock title={title} text={text} />
    </div>
    <img src={Spinner} alt="" width={32} height={32} className="ts-animate-spin" />
  </PluginCard>
)
