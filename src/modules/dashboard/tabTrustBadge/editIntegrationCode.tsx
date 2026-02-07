import { FC } from 'preact/compat'
import { h, Fragment } from 'preact'
import { getParsedTrustbadgeDataStrToObj } from './parseTrustbadgeData'
import { isEqual } from '@/utils'
import TextWithLink from '@/components/layouts/textWithLink'
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
  phrasesByKey,
  isDisabled,
  textStr,
  onChangeScript,
  setTextStr,
  setIsButtonDisabled,
  initialTrustbadgeDataChild,
}) => {
  return (
    <>
      <h2 className={`ts-text-default ts-text-sm ts-font-bold ts-mb-1 ${isDisabled && 'ts-opacity-25'}`}>
        Integration code
      </h2>
      <p className={`ts-text-sm ts-font-normal ts-mb-4 ${isDisabled && 'ts-opacity-25'}`} style={{ color: '#6b7280' }}>
        Paste or edit your Trustbadge integration code below.
      </p>
      <div className="ts-mb-6">
        <textarea
          disabled={isDisabled}
          value={textStr}
          className={`ts-w-full ts-p-4 ts-text-sm ts-border-0 ts-outline-none ts-resize-y ${isDisabled ? 'ts-opacity-50' : ''}`}
          style={{
            height: '280px',
            backgroundColor: '#F9FAFB',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#374151',
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
      </div>
      <div
        className="ts-flex ts-items-start ts-gap-3 ts-p-4"
        style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #DBEAFE',
          borderRadius: '10px',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="ts-flex-shrink-0 ts-mt-0.5">
          <circle cx="8" cy="8" r="6.5" stroke="#3B82F6" stroke-width="1.2" fill="none" />
          <path d="M8 5.5V8.5" stroke="#3B82F6" stroke-width="1.2" stroke-linecap="round" />
          <circle cx="8" cy="10.5" r="0.6" fill="#3B82F6" />
        </svg>
        <TextWithLink
          id={'trustbadge_expert_help'}
          url={phrasesByKey.application_trustbadge_expert_help_url_1}
          text={phrasesByKey.application_trustbadge_expert_help_text}
          textStyle="ts-text-sm"
          linkStyle="!ts-text-[#2563EB]"
        />
      </div>
    </>
  )
}

export default EditIntegrationCodeProps
