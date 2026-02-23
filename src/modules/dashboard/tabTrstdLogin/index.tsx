import { h } from 'preact'
import { FC } from 'preact/compat'
import { TabProps } from '@/modules/type'
import { ComingSoonIcon } from '@/components/layouts/icons/ComingSoonIcon'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TrstdLoginTab: FC<TabProps> = ({ phrasesByKey }) => {
  return (
    <div className="ts-flex ts-flex-col ts-gap-6">
      {/* Header - no card */}
      <div className="ts-pb-2">
        <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
          #trstd login
        </h2>
        <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280' }}>
          Configure your Trusted Shops login integration. More features coming soon.
        </p>
      </div>

      {/* Empty state card */}
      <div
        className="ts-bg-white ts-rounded-[14px] ts-p-8 ts-flex ts-flex-col ts-items-center ts-justify-center"
        style={{
          border: '1px solid #E5E7EB',
          minHeight: '240px',
        }}
      >
        <div className="ts-mb-4">
          <ComingSoonIcon />
        </div>
        <p className="ts-text-sm ts-font-bold ts-text-default ts-mb-1">
          Coming soon
        </p>
        <p className="ts-text-sm ts-font-normal" style={{ color: '#9CA3AF' }}>
          This section is under development.
        </p>
      </div>
    </div>
  )
}

export default TrstdLoginTab
