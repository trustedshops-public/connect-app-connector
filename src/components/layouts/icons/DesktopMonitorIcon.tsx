import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  customClass?: string
}

export const DesktopMonitorIcon: FC<Props> = ({ customClass }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    className={customClass}
  >
    <rect x="1.5" y="2" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M5.5 14H10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M8 11V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)
