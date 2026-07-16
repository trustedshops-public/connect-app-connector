import { h } from 'preact'
import { FC } from 'preact/compat'

interface Props {
  label: string
  id?: string
  /**
   * The badge hides itself automatically once this date is reached.
   * Omit to show the badge permanently.
   */
  visibleUntil?: Date
}

const NewFeatureBadge: FC<Props> = ({ label, id, visibleUntil }) => {
  if (visibleUntil && new Date() >= visibleUntil) return null

  return (
    <span
      id={id}
      className="ts-flex-shrink-0 ts-font-bold"
      style={{
        backgroundColor: '#DBEAFE',
        color: '#1D4ED8',
        borderRadius: '9999px',
        padding: '4px 14px',
        margin: '0 8px 16px 8px',
        fontSize: '13px',
        lineHeight: '20px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

export default NewFeatureBadge
