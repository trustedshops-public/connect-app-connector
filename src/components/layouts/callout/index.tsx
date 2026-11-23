import { ComponentChildren, h } from 'preact'
import { FC } from 'preact/compat'
import WarningIcon from '@/assets/connect/icon-warning.svg'
import CheckCircleIcon from '@/assets/connect/icon-check-circle.svg'
import ErrorIcon from '@/assets/connect/icon-error.svg'
import CloseIcon from '@/assets/connect/icon-close-banner.svg'

export type CalloutTone = 'warning' | 'success' | 'error'

const TONES: Record<
  CalloutTone,
  { background: string; border: string; tile: string; title: string; icon: string }
> = {
  warning: {
    background: '#FFFBEB',
    border: '#FEE685',
    tile: '#FEF3C6',
    title: '#7B3306',
    icon: WarningIcon,
  },
  success: {
    background: '#F0FDF4',
    border: '#B9F8CF',
    tile: '#DCFCE7',
    title: '#0D542B',
    icon: CheckCircleIcon,
  },
  error: {
    background: '#FEF2F2',
    border: '#FFC9C9',
    tile: '#FFE2E2',
    title: '#82181A',
    icon: ErrorIcon,
  },
}

interface Props {
  id?: string
  tone: CalloutTone
  title?: string
  children: ComponentChildren
  // A 40px tile behind the icon, as on the connect cards and the dashboard banner
  withIconTile?: boolean
  icon?: string
  padding?: string
  radius?: number
  // Text gap under the title
  gap?: number
  onClose?: () => void
  closeLabel?: string
}

/**
 * The connect screens' callout: an icon, a title and a sentence, tinted by tone.
 * Without a title, the sentence takes the tone's colour (an error message).
 */
const Callout: FC<Props> = ({
  id,
  tone,
  title,
  children,
  withIconTile,
  icon,
  padding = '16px',
  radius = 12,
  gap = 4,
  onClose,
  closeLabel,
}) => {
  const colours = TONES[tone]
  const iconImg = <img src={icon ?? colours.icon} alt="" width={20} height={20} />

  return (
    <div
      id={id}
      data-testid={id}
      role={tone === 'error' ? 'alert' : 'status'}
      className="ts-flex ts-items-start ts-gap-3 ts-w-full ts-font-inter"
      style={{
        backgroundColor: colours.background,
        border: `1px solid ${colours.border}`,
        borderRadius: `${radius}px`,
        padding,
      }}
    >
      {withIconTile ? (
        <div
          className="ts-flex ts-items-center ts-justify-center ts-flex-shrink-0 ts-rounded-[10px]"
          style={{ width: '40px', height: '40px', backgroundColor: colours.tile }}
        >
          {iconImg}
        </div>
      ) : (
        <div className="ts-flex-shrink-0">{iconImg}</div>
      )}
      <div
        className="ts-flex ts-flex-col ts-flex-1 ts-min-w-0"
        style={{ gap: `${gap}px`, fontSize: '14px', lineHeight: '20px' }}
      >
        {title && (
          <p className="ts-font-semibold" style={{ color: colours.title }}>
            {title}
          </p>
        )}
        <p className="ts-font-normal" style={{ color: title ? '#364153' : colours.title }}>
          {children}
        </p>
      </div>
      {onClose && (
        <button
          id={id ? `${id}_close` : undefined}
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="ts-flex ts-items-center ts-justify-center ts-flex-shrink-0 ts-rounded-[8px] ts-cursor-pointer ts-bg-transparent ts-border-0 hover:ts-bg-black/5"
          style={{ width: '32px', height: '32px' }}
        >
          <img src={CloseIcon} alt="" width={20} height={20} />
        </button>
      )}
    </div>
  )
}

export default Callout
