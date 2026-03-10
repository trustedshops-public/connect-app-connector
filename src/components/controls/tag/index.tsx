import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  label: string
  isWarning?: boolean
  variant?: 'status' | 'productReviews' | 'serviceReviews' | 'trustedCheckout'
}

const Tag: FC<Props> = ({ label, isWarning, variant = 'status' }: Props) => {
  const getStyles = () => {
    if (variant === 'productReviews') {
      return {
        bg: '#F3E8FF',
        color: '#6E11B0',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 1L1.5 3V10C1.5 10.2652 1.60536 10.5196 1.79289 10.7071C1.98043 10.8946 2.23478 11 2.5 11H9.5C9.76522 11 10.0196 10.8946 10.2071 10.7071C10.3946 10.5196 10.5 10.2652 10.5 10V3L9 1H3Z" stroke="#6E11B0" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1.5 3H10.5" stroke="#6E11B0" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 5C8 5.53043 7.78929 6.03914 7.41421 6.41421C7.03914 6.78929 6.53043 7 6 7C5.46957 7 4.96086 6.78929 4.58579 6.41421C4.21071 6.03914 4 5.53043 4 5" stroke="#6E11B0" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        ),
      }
    }
    if (variant === 'serviceReviews') {
      return {
        bg: '#DBEAFE',
        color: '#1D4ED8',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1.5L7.3 4.1L10.2 4.5L8.1 6.5L8.6 9.4L6 8L3.4 9.4L3.9 6.5L1.8 4.5L4.7 4.1L6 1.5Z" stroke="#1D4ED8" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          </svg>
        ),
      }
    }
    if (variant === 'trustedCheckout') {
      return {
        bg: '#DBEAFE',
        color: '#1D4ED8',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 6L5.5 7L7.5 5" stroke="#1D4ED8" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="6" cy="6" r="4" stroke="#1D4ED8" stroke-width="1" fill="none" />
          </svg>
        ),
      }
    }
    // Default: status
    if (isWarning) {
      return {
        bg: '#FEF3C6',
        color: '#973C00',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#973C00" stroke-width="1" fill="none" />
            <path d="M6 4V6.5" stroke="#973C00" stroke-width="1" stroke-linecap="round" />
            <circle cx="6" cy="8" r="0.5" fill="#973C00" />
          </svg>
        ),
      }
    }
    return {
      bg: '#DCFCE7',
      color: '#079455',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="#079455" stroke-width="1" fill="none" />
          <path d="M4 6L5.5 7.5L8 4.5" stroke="#079455" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      ),
    }
  }

  const styles = getStyles()

  return (
    <div
      className="ts-px-2.5 ts-py-1 ts-flex ts-items-center ts-gap-1 ts-w-max ts-rounded-full ts-truncate"
      style={{ backgroundColor: styles.bg, color: styles.color, fontSize: '12px' }}
    >
      {styles.icon}
      <span title={label} className="ts-truncate ts-font-normal" style={{ lineHeight: '16px' }}>
        {label}
      </span>
    </div>
  )
}

export default Tag
