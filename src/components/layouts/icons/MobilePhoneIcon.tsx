import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  customClass?: string
}

export const MobilePhoneIcon: FC<Props> = ({ customClass }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    className={customClass}
  >
    <rect x="3.5" y="1.5" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M6.5 12.5H9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)
