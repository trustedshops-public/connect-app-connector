import { ComponentChildren, h } from 'preact'
import { FC } from 'preact/compat'

export type ButtonVariant = 'primary' | 'outlined' | 'danger'

interface Props {
  id?: string
  variant?: ButtonVariant
  type?: string
  disabled?: boolean
  onClick?: (e: Event) => void
  fullWidth?: boolean
  flex1?: boolean
  height?: number
  children: ComponentChildren
  className?: string
}

const variantStyles: Record<ButtonVariant, { background: string; color: string; border: string }> = {
  primary: {
    background: 'linear-gradient(180deg, #1c8dc6 0%, #005aa0 100%)',
    color: '#FFFFFF',
    border: 'none',
  },
  outlined: {
    background: 'linear-gradient(180deg, #F7F7F7 0%, #F5F5F5 9%, #E8E8E8 100%)',
    color: '#005aa0',
    border: '1px solid #D1D5DB',
  },
  danger: {
    background: 'linear-gradient(180deg, #F7F7F7 0%, #F5F5F5 9%, #E8E8E8 100%)',
    color: '#B91C1C',
    border: '1px solid #9E262A',
  },
}

const StyledButton: FC<Props> = ({
  id,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  fullWidth,
  flex1,
  height = 36,
  children,
  className = '',
}) => {
  const styles = variantStyles[variant]

  return (
    <button
      id={id ? `button_${id}` : undefined}
      data-testid={id ? `button_${id}` : undefined}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`ts-text-sm ts-font-bold ts-cursor-pointer ts-flex ts-items-center ts-justify-center ts-gap-2 disabled:ts-opacity-50 disabled:ts-cursor-not-allowed ${fullWidth ? 'ts-w-full' : ''} ${flex1 ? 'ts-flex-1' : ''} ${className}`}
      style={{
        height: `${height}px`,
        borderRadius: '4px',
        background: styles.background,
        color: styles.color,
        border: styles.border,
        padding: '8px 24px',
      }}
    >
      {children}
    </button>
  )
}

export default StyledButton
