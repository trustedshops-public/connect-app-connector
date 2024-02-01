import { ComponentChildren, h } from 'preact'
import { FC } from 'preact/compat'

interface Props {
  children: ComponentChildren
  value: string | number
  selected?: boolean
  changeSelectedOption: (value: string | number) => void
  disabled?: boolean
  id?: string
  testId?: string
}

const Option: FC<Props> = ({
  children,
  value,
  changeSelectedOption,
  selected,
  disabled,
  id,
  testId,
}) => {
  const listItemClassName = `ts-flex hover:ts-bg-gray-100 ts-cursor-pointer ${
    selected && 'ts-bg-gray-light-200'
  } ${disabled ? 'ts-disabled' : ''}`

  const disabledStyles = {
    opacity: 0.5,
    pointerEvents: 'none',
  }

  return (
    <li
      id={`select_${id}`}
      data-testid={`select_${testId}`}
      key={value}
      className={listItemClassName}
      style={{ ...(disabled ? disabledStyles : {}) }}
      onClick={() => !disabled && changeSelectedOption(value)}
    >
      {children}
    </li>
  )
}

export default Option
