import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  size?: number
  customClass?: string
}

export const InfoCircleOutlinedIcon: FC<Props> = ({ size = 16, customClass }) => {
  const scale = size / 16
  const r = 6.5 * scale
  const cx = 8 * scale
  const cy = 8 * scale

  if (size === 20) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={customClass}>
        <circle cx="10" cy="10" r="9" stroke="#3B82F6" stroke-width="1.5" fill="none" />
        <path d="M10 9V14" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="10" cy="6.5" r="0.75" fill="#3B82F6" />
      </svg>
    )
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={customClass}>
      <circle cx="8" cy="8" r="6.5" stroke="#3B82F6" stroke-width="1.2" fill="none" />
      <path d="M8 5.5V8.5" stroke="#3B82F6" stroke-width="1.2" stroke-linecap="round" />
      <circle cx="8" cy="10.5" r="0.6" fill="#3B82F6" />
    </svg>
  )
}
