import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  color?: string
}

export const ArrowRightLineIcon: FC<Props> = ({ color = '#005AA0' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.91699 7H11.0837" stroke={color} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 2.91675L11.0833 7.00008L7 11.0834" stroke={color} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)
