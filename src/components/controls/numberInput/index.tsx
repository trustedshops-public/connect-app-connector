import { FC, useEffect, useState } from 'preact/compat'
import Input from '../input'
import { h } from 'preact'
import './style.css' // TODO: https://github.com/tailwindlabs/tailwindcss/issues/1101

interface Props {
  value: string | number | undefined
  onChange: (value: string) => void
  min?: string | number
  max?: string | number
  disabled?: boolean
  id?: string
}

const NumberInput: FC<Props> = ({ value = '', min, max, disabled, onChange, id }) => {
  const [val, setVal] = useState<number | string>(validateValue(value).toString())

  useEffect(() => {
    if (!value) return

    setVal(validateValue(value).toString())
  }, [value])

  function validateValue(value: string | number): number | string {
    if (value !== '' && min !== undefined && max !== undefined) {
      if (Number(value) < Number(min)) {
        value = min
      }
      if (Number(value) > Number(max)) {
        value = max
      }
    }
    return value
  }

  const onChangeValue = (value: string | number): string => {
    value = validateValue(value)
    setVal(value.toString())
    return value.toString()
  }

  return (
    <div className={`ts-relative ts-w-full`}>
      <Input
        id={`number_${id}`}
        type="number"
        value={val.toString()}
        onChange={onChangeValue}
        min={min?.toString()}
        max={max?.toString()}
        disabled={disabled}
        onBlur={() => onChange(val.toString())}
        customClass="[appearance:textfield] !ts-pr-10 !ts-h-[40px] !ts-rounded-[8px] !ts-border-gray-200"
      />
      <div
        className="ts-absolute ts-right-0 ts-top-0 ts-flex ts-flex-col ts-h-full"
        style={{ borderLeft: '1px solid #E5E7EB', borderRadius: '0 8px 8px 0', overflow: 'hidden' }}
      >
        <button
          id={`input_number_increment_${id}`}
          data-testid={`input_number_increment_${id}`}
          disabled={disabled}
          onClick={() => {
            onChange(onChangeValue(+val + 1))
          }}
          className={`ts-flex ts-items-center ts-justify-center ts-bg-white ts-border-0 ts-cursor-pointer hover:ts-bg-gray-50
            ${disabled ? 'ts-opacity-25 ts-cursor-not-allowed' : ''}`}
          style={{ width: '32px', flex: 1, borderBottom: '1px solid #E5E7EB', fontSize: '14px', color: '#374151' }}
        >
          +
        </button>
        <button
          id={`input_number_decrement_${id}`}
          data-testid={`input_number_decrement_${id}`}
          disabled={disabled}
          onClick={() => {
            onChange(onChangeValue(+val - 1))
          }}
          className={`ts-flex ts-items-center ts-justify-center ts-bg-white ts-border-0 ts-cursor-pointer hover:ts-bg-gray-50
            ${disabled ? 'ts-opacity-25 ts-cursor-not-allowed' : ''}`}
          style={{ width: '32px', flex: 1, fontSize: '14px', color: '#374151' }}
        >
          −
        </button>
      </div>
    </div>
  )
}

export default NumberInput
