import { FC } from 'preact/compat'
import { h } from 'preact'
import { IChannelTS } from '@/store/channel/types'
import { Option, Select } from '@/components/controls/dropdown'
import { getSelectedAndMappedChannels } from '@/store/channel/mapperForChannels'
import { selectorChannels, selectorInfoOfSystem } from '@/store/selector'
import { DASHBOARD_KEYS } from '@/locales/types'
import useStore from '@/store/useStore'

const ChannelSelectionForm: FC<{ phrasesByKey: Nullable<DASHBOARD_KEYS> }> = ({ phrasesByKey }) => {
  const { setSelectedChannels } = useStore()
  const { selectedChannels, shopChannels, channelsFromTSC } = useStore(selectorChannels)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  const onChangeChannel = (shopChannel: IChannelTS, channelFromTSC: Nullable<IChannelTS>) => {
    setSelectedChannels(getSelectedAndMappedChannels(shopChannel, channelFromTSC, selectedChannels))
  }

  return (
    <div id="mapping_table" className="ts-relative ts-w-full">
      {/* Column headers - hidden on mobile */}
      <div className="ts-hidden sm:ts-flex ts-items-center ts-py-3 ts-mb-2">
        <div className="ts-w-1/2">
          <p
            id={'shopsystem_title'}
            className="ts-font-bold ts-text-left"
            style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}
          >
            {phrasesByKey?.channelSelect_title_shopsystem.replace(
              '[%]shopsystem[%]',
              infoOfSystem.nameOfSystem,
            )}
          </p>
        </div>
        <div className="ts-w-1/2">
          <p
            className="ts-font-bold ts-text-left"
            style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}
          >
            {phrasesByKey?.channelSelect_title_etrusted}
          </p>
        </div>
      </div>

      {/* Channel rows - stack on mobile */}
      {shopChannels.map((elem, index) => (
        <div
          id={`mapping_row_${elem.id}`}
          key={elem.id}
          className="ts-flex ts-flex-col sm:ts-flex-row sm:ts-items-center ts-py-4 ts-border-t ts-border-gray-100 ts-gap-3 sm:ts-gap-0"
        >
          <div className="sm:ts-w-1/2">
            <p
              id={`shopsystem_name_${elem.id}`}
              className="ts-text-default ts-font-normal ts-text-sm"
            >
              {elem.name}
            </p>
            {elem.url && (
              <p className="ts-text-xs" style={{ color: '#9ca3af' }}>
                {elem.url}
              </p>
            )}
          </div>
          <div className="sm:ts-w-1/2">
            <Select
              testId={`channelSelectionForm_${index}`}
              id={`channelSelectionForm_${elem.id}`}
              placeholder={phrasesByKey?.global_placeholder_channel}
              defaultValue={
                selectedChannels
                  ? selectedChannels.find(item => item.salesChannelRef === elem.id)
                      ?.eTrustedName
                  : null
              }
            >
              <Option
                testId={`widgetLocation_deselect`}
                id={`widgetLocation_deselect`}
                value={'deselect'}
                changeSelectedOption={() => onChangeChannel(elem, null)}
              >
                <p className="ts-m-2 ts-text-error ts-text-sm">
                  {phrasesByKey?.global_placeholder_channel}
                </p>
              </Option>
              {channelsFromTSC.map((item, optionIndex) => (
                <Option
                  testId={`channel_${optionIndex}`}
                  id={`channel_${item.id}`}
                  key={item.id}
                  value={item.id}
                  selected={selectedChannels.some(
                    chn =>
                      chn.eTrustedChannelRef === item.id && chn.salesChannelRef === elem.id,
                  )}
                  changeSelectedOption={() => onChangeChannel(elem, item)}
                >
                  <p
                    id={`channel_name_${item.id}`}
                    className="ts-m-2 ts-text-darkLabel ts-font-normal ts-text-sm ts-text-ellipsis ts-overflow-hidden"
                  >
                    {item.name}
                  </p>
                </Option>
              ))}
            </Select>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChannelSelectionForm
