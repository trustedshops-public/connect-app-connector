import { FC } from 'preact/compat'
import { h } from 'preact'

export const HelpCircleIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <circle cx="20" cy="20" r="19" fill="#EFF6FF" stroke="#DBEAFE" stroke-width="1" />
    <circle cx="20" cy="20" r="8" stroke="#3B82F6" stroke-width="1.5" fill="none" />
    <path d="M20 17V20.5" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" />
    <circle cx="20" cy="23" r="0.75" fill="#3B82F6" />
  </svg>
)
