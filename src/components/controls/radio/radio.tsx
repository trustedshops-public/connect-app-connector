import { ComponentChildren, h } from 'preact'
import { FC } from 'preact/compat'

interface Props {
  children: ComponentChildren
  value: string | number
  id: string | number
  disabled?: boolean
  customClass?: string
  onClick?: () => void
}

const Radio: FC<Props> = ({ value, id, disabled, children, customClass, onClick }) => {
  const isSelected = value === id.toString()

  return (
    <button
      type="button"
      onClick={() => {
        if (disabled) return
        if (typeof onClick !== 'undefined') onClick()
      }}
      className={`ts-flex ts-items-center ts-cursor-pointer ts-bg-transparent ts-border-0 ts-p-0 ts-text-left ${customClass || ''} ${
        disabled ? 'ts-opacity-25 ts-cursor-not-allowed' : ''
      }`}
      id={id.toString()}
    >
      <input type="radio" id={id.toString()} className="ts-hidden" />

      <div
        id={id.toString()}
        className="ts-flex ts-items-center ts-justify-center ts-flex-shrink-0"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: isSelected ? '2px solid #155DFC' : '2px solid #D1D5DB',
          backgroundColor: isSelected ? '#155DFC' : '#FFFFFF',
          transition: 'all 0.15s ease',
        }}
      >
        {isSelected && (
          <div
            id={id.toString()}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
            }}
          />
        )}
      </div>

      <label
        id={id.toString()}
        className="ts-font-medium ts-text-default ts-ml-3 ts-block ts-cursor-pointer"
      >
        {children}
      </label>
    </button>
  )
}

export default Radio
