import { FC } from 'preact/compat'
import { h } from 'preact'

interface Props {
  label: string
  isWarning?: boolean
}

const Tag: FC<Props> = ({ label, isWarning }: Props) => {
  return (
    <div
      style={{ maxWidth: '100%', fontSize: '8px' }}
      className={`ts-px-1 ts-h-4 ts-flex ts-items-center ts-w-max ts-text-xxs ts-text-white ts-rounded ts-truncate ${
        isWarning ? 'ts-bg-red-500' : 'ts-bg-green-500'
      }`}
    >
      <p title={label} className={'ts-truncate'}>
        {label}
      </p>
    </div>
  )
}

export default Tag
