import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  customClass?: string
}

export const InfoCircleFilledIcon: FC<Props> = ({ customClass }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className={customClass}>
    <circle cx="9" cy="9" r="9" fill="#374151" />
    <path d="M9 8V13" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" />
    <circle cx="9" cy="5.5" r="0.85" fill="#FFFFFF" />
  </svg>
)
