import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  customClass?: string
}

export const EyeIcon: FC<Props> = ({ customClass }) => {
  return (
    <svg
      className={customClass}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M1.7181 10.2901C1.64865 10.103 1.64865 9.89715 1.7181 9.71006C2.39452 8.06993 3.5427 6.66759 5.01708 5.6808C6.49146 4.69402 8.22564 4.16724 9.99977 4.16724C11.7739 4.16724 13.5081 4.69402 14.9825 5.6808C16.4568 6.66759 17.605 8.06993 18.2814 9.71006C18.3509 9.89715 18.3509 10.103 18.2814 10.2901C17.605 11.9302 16.4568 13.3325 14.9825 14.3193C13.5081 15.3061 11.7739 15.8329 9.99977 15.8329C8.22564 15.8329 6.49146 15.3061 5.01708 14.3193C3.5427 13.3325 2.39452 11.9302 1.7181 10.2901Z"
        stroke="#155DFC"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke="#155DFC"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
