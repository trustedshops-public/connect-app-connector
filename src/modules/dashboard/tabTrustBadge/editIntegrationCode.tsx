import { FC } from 'preact/compat'
import { h } from 'preact'
import { getParsedTrustbadgeDataStrToObj } from './parseTrustbadgeData'
import { isEqual } from '@/utils'
import { DASHBOARD_KEYS } from '@/locales/types'
import { ITrustbadgeChildren } from '@/baseLayers/types'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  isDisabled: boolean
  textStr: string
  initialTrustbadgeDataChild: ITrustbadgeChildren
  onChangeScript: (v: string) => void
  setTextStr: (v: string) => void
  setIsButtonDisabled: (v: boolean) => void
}

const EditIntegrationCodeProps: FC<Props> = ({
  isDisabled,
  textStr,
  onChangeScript,
  setTextStr,
  setIsButtonDisabled,
  initialTrustbadgeDataChild,
}) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(textStr)
  }

  return (
    <div className="ts-mt-6">
      <div className="ts-flex ts-items-center ts-justify-between ts-mb-2">
        <span className="ts-text-sm ts-font-normal ts-text-default">
          Integration Code
        </span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="ts-text-sm ts-font-normal ts-border-0 ts-bg-transparent ts-cursor-pointer ts-p-0"
          style={{ color: '#2563EB' }}
          disabled={isDisabled}
        >
          Copy code
        </button>
      </div>
      <textarea
        disabled={isDisabled}
        value={textStr}
        className={`ts-w-full ts-p-4 ts-text-sm ts-border-0 ts-outline-none ts-resize-y ${isDisabled ? 'ts-opacity-50' : ''}`}
        style={{
          height: '240px',
          backgroundColor: '#1F2937',
          borderRadius: '10px',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#E5E7EB',
        }}
        onBlur={e => {
          onChangeScript((e.target as HTMLInputElement).value)
        }}
        onChange={e => {
          setTextStr((e.target as HTMLInputElement).value)
          setIsButtonDisabled(
            isEqual(
              getParsedTrustbadgeDataStrToObj((e.target as HTMLInputElement).value),
              initialTrustbadgeDataChild
            )
          )
        }}
      />
      <p className="ts-text-xs ts-font-normal ts-mt-2" style={{ color: '#6b7280' }}>
        Paste this code into your shop's theme files before the closing &lt;/body&gt; tag.
      </p>
    </div>
  )
}

export default EditIntegrationCodeProps
