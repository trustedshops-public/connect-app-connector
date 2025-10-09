import { ComponentChildren, h, toChildArray, cloneElement, VNode } from 'preact'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { FC } from 'preact/compat'
import { ChevronDownIcon } from '@/components/layouts/icons'

interface Props {
  children: ComponentChildren
  defaultValue: Nullable<string | undefined>
  placeholder?: string
  disabled?: boolean
  isError?: boolean
  id?: string
  className?: string
  testId?: string
}

type OptionChildProps = {
  value: string | number
  selected?: boolean
  disabled?: boolean
  id?: string
  testId?: string
  changeSelectedOption: (value: string | number) => void
  isActive?: boolean
  onHover?: () => void
  innerRef?: (el: HTMLLIElement | null) => void
  role?: string
  'aria-selected'?: boolean
  tabIndex?: number
}

type OptionVNode = VNode<OptionChildProps>

const Select: FC<Props> = ({
  children,
  defaultValue,
  placeholder,
  disabled,
  isError,
  id,
  className,
  testId,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([])

  const containerRef = useRef<HTMLDivElement>(null)

  const selectPlaceholder = placeholder
  id = id?.replace(/[\/:\\]/g, '')

  const options = useMemo(() => {
    const arr = toChildArray(children) as OptionVNode[]
    return arr.filter(Boolean) as OptionVNode[]
  }, [children])

  const enabledIndexes = useMemo(
    () =>
      options
        .map((child, idx) => ({ idx, disabled: !!child?.props?.disabled }))
        .filter(o => !o.disabled)
        .map(o => o.idx),
    [options],
  )

  const selectedIndex = useMemo(() => {
    const idx = options.findIndex(ch => ch?.props?.selected)
    return idx
  }, [options])

  useEffect(() => {
    if (isOpen) {
      const start =
        selectedIndex > -1 && !options[selectedIndex]?.props?.disabled
          ? selectedIndex
          : enabledIndexes[0] ?? -1
      setActiveIndex(start)

      setTimeout(() => {
        listRef.current?.focus()

        if (start > -1) {
          optionRefs.current[start]?.scrollIntoView({ block: 'nearest' })
        }
      }, 0)
    }
  }, [isOpen, selectedIndex, enabledIndexes, options])

  useEffect(() => {
    if (isOpen && activeIndex > -1) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('click', onDocClick, true)
    return () => document.removeEventListener('click', onDocClick, true)
  }, [isOpen])

  const moveActive = (direction: 1 | -1) => {
    if (!enabledIndexes.length) return
    if (activeIndex === -1) {
      setActiveIndex(enabledIndexes[0])
      return
    }
    const currentPos = enabledIndexes.indexOf(activeIndex)
    const nextPos = Math.min(Math.max(currentPos + direction, 0), enabledIndexes.length - 1)
    setActiveIndex(enabledIndexes[nextPos])
  }

  const moveHomeEnd = (toEnd = false) => {
    if (!enabledIndexes.length) return
    setActiveIndex(toEnd ? enabledIndexes[enabledIndexes.length - 1] : enabledIndexes[0])
  }

  const commitSelection = (idx: number) => {
    const opt = options[idx]
    if (!opt) return
    const {
      value,
      changeSelectedOption,
      disabled: isOptDisabled,
    } = (opt.props || {}) as OptionChildProps
    if (isOptDisabled) return
    changeSelectedOption?.(value)
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  const onButtonKeyDown = (e: KeyboardEvent) => {
    if (disabled) return
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault()
        setIsOpen(true)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        setIsOpen(o => !o)
        break
      default:
        break
    }
  }

  const onListKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        moveActive(-1)
        break
      case 'Home':
        e.preventDefault()
        moveHomeEnd(false)
        break
      case 'End':
        e.preventDefault()
        moveHomeEnd(true)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIndex > -1) commitSelection(activeIndex)
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        buttonRef.current?.focus()
        break
      case 'Tab':
        setIsOpen(false)
        break
      default:
        break
    }
  }

  const buttonClasses = `ts-flex ts-justify-between ts-items-center ts-h-8 ts-w-full ts-border-solid ts-border ts-rounded focus:ts-outline-none focus:ts-ring-2 focus:ts-ring-blue-800 focus:ts-border-transparent ts-pl-2 ts-pr-1
    ${disabled ? 'ts-opacity-25 ts-cursor-not-allowed' : ''}
    ${
      isError
        ? 'ts-bg-backgroundError ts-border-red-500'
        : 'ts-bg-gradient-to-b ts-appearance-none ts-from-gray-light-100 ts-to-gray-light-200 ts-border-gray-border hover:ts-outline-none hover:ts-border-gray-400 hover:ts-bg-gradient-to-b hover:ts-appearance-none hover:ts-from-white hover:ts-to-gray-light-300'
    }`

  const listboxId = `listContainer_${id}`

  return (
    <div ref={containerRef} className={`ts-relative ${className || ''}`}>
      <button
        ref={buttonRef}
        id={`select_${id}`}
        data-testid={`select_${testId}`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        onClick={() => {
          if (disabled) return
          setIsOpen(!isOpen)
        }}
        onKeyDown={onButtonKeyDown}
        disabled={disabled}
        className={buttonClasses}
      >
        <p
          id={`selectValue_${id}`}
          data-testid={`selectValue_${testId}`}
          className="ts-text-default ts-font-normal ts-text-sm ts-truncate"
        >
          {defaultValue || selectPlaceholder}
        </p>
        <ChevronDownIcon
          customClass={`"ts-fill-current ts-h-6 ts-w-6 ts-transform ${
            isOpen ? 'ts--rotate-180' : ''
          } ts-transition ts-duration-150 ts-ease-in-out"`}
        />
      </button>

      {isOpen && (
        <div className="ts-absolute ts-w-full ts-bg-white ts-border ts-rounded ts-max-h-80 ts-overflow-auto ts-shadow-md ts-z-10">
          <ul
            id={listboxId}
            data-testid={`listContainer_${testId}`}
            role="listbox"
            aria-activedescendant={
              activeIndex > -1 ? `option_${options[activeIndex]?.props?.id}` : undefined
            }
            ref={listRef}
            tabIndex={-1}
            onKeyDown={onListKeyDown}
          >
            {options.map((child, idx) => {
              const props = child.props as OptionChildProps
              return cloneElement(child, {
                role: 'option',
                'aria-selected': !!props.selected,
                tabIndex: -1,
                isActive: idx === activeIndex,
                onHover: () => setActiveIndex(idx),
                innerRef: (el: HTMLLIElement | null) => {
                  optionRefs.current[idx] = el
                },
                onCommit: () => {
                  setIsOpen(false)
                  buttonRef.current?.focus()
                },
              })
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Select
