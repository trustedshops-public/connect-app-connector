import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  color?: string
  size?: number
}

export const LinkIcon: FC<Props> = ({ color = '#FFFFFF', size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6.667 8.667a3.333 3.333 0 0 0 5.026.36l2-2a3.333 3.333 0 0 0-4.713-4.714l-1.147 1.14"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.333 7.333a3.333 3.333 0 0 0-5.026-.36l-2 2a3.333 3.333 0 0 0 4.713 4.714l1.14-1.14"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)
