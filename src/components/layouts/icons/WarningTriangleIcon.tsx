import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  customClass?: string
}

export const WarningTriangleIcon: FC<Props> = ({ customClass }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={customClass}
  >
    <path
      d="M8.57465 3.21665L1.51632 14.9833C1.37079 15.2353 1.29379 15.5214 1.29298 15.8128C1.29216 16.1042 1.36756 16.3907 1.51167 16.6436C1.65578 16.8964 1.86359 17.1069 2.11468 17.2543C2.36578 17.4016 2.65124 17.4808 2.94265 17.4833H17.0577C17.3491 17.4808 17.6345 17.4016 17.8856 17.2543C18.1367 17.1069 18.3445 16.8964 18.4886 16.6436C18.6328 16.3907 18.7082 16.1042 18.7073 15.8128C18.7065 15.5214 18.6295 15.2353 18.484 14.9833L11.4257 3.21665C11.2771 2.97174 11.0673 2.76905 10.8171 2.62891C10.567 2.48877 10.2848 2.41553 9.99798 2.41553C9.71118 2.41553 9.42901 2.48877 9.17884 2.62891C8.92867 2.76905 8.71887 2.97174 8.57465 3.21665Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <path d="M10 7.5V10.8333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 14.1667H10.0083" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)
