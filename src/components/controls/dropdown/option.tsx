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
  isActive?: boolean
  onHover?: () => void
  innerRef?: (el: HTMLLIElement | null) => void
  'aria-selected'?: boolean
  tabIndex?: number
  onCommit?: () => void
}

const Option: FC<Props> = ({
  children,
  value,
  changeSelectedOption,
  selected,
  disabled,
  id,
  testId,
  isActive,
  onHover,
  innerRef,
  tabIndex,
  onCommit,
  ...rest
}) => {
  const className = `
    ts-flex ts-items-center ts-min-h-8 ts-w-full ts-cursor-pointer
    hover:ts-bg-gray-100
    ${isActive ? 'ts-bg-gray-light-200 ts-ring-1 ts-ring-offset-1' : ''}
    ${selected ? 'ts-font-medium' : ''}
    ${disabled ? 'ts-opacity-50 ts-pointer-events-none' : ''}
  `.trim()

  const handleClick = (): void => {
    if (disabled) return
    changeSelectedOption(value)
    onCommit?.()
  }

  return (
    <li
      id={`option_${id}`}
      data-testid={`select_${testId}`}
      key={value}
      ref={innerRef}
      className={className}
      aria-selected={!!selected}
      tabIndex={tabIndex ?? -1}
      onMouseEnter={onHover}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </li>
  )
}

export default Option
