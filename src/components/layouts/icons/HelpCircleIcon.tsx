import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  customClass?: string
}

export const HelpCircleIcon: FC<Props> = ({ customClass }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={customClass}>
    <path d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 13.3333V10" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 6.66699H10.0083" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)
