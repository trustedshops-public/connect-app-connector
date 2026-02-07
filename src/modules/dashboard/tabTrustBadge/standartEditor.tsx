import { FC } from 'preact/compat'
import { h } from 'preact'
import { Option, Select } from '@/components/controls/dropdown'
import { DASHBOARD_KEYS } from '@/locales/types'
import { ITrustbadgeChildren } from '@/baseLayers/types'
import NumberInput from '@/components/controls/numberInput'
import { PlacementDesktop, PlacementMobile } from './parseTrustbadgeData'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  isDisabled: boolean
  trustbadgeDataChild: ITrustbadgeChildren
  placementPhrase: { [key: string]: string }
  updateTrustbadgeData: (obj: {
    [key: string]: {
      value?: string | number | boolean | undefined
      attributeName?: string | undefined
    }
  }) => void
}

const StandartEditor: FC<Props> = ({
  phrasesByKey,
  isDisabled,
  trustbadgeDataChild,
  updateTrustbadgeData,
  placementPhrase,
}) => {
  return (
    <div>
      {/* Desktop section */}
      <div className="ts-mb-8">
        <div className="ts-flex ts-items-center ts-gap-2 ts-mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2" width="13" height="9" rx="1" stroke="#374151" stroke-width="1.2" fill="none" />
            <path d="M5.5 14H10.5" stroke="#374151" stroke-width="1.2" stroke-linecap="round" />
            <path d="M8 11V14" stroke="#374151" stroke-width="1.2" stroke-linecap="round" />
          </svg>
          <span className={`ts-text-sm ts-font-bold ts-text-default ${isDisabled && 'ts-opacity-25'}`}>
            Desktop
          </span>
        </div>
        <div className="ts-flex ts-items-center ts-gap-6">
          <div className="ts-flex ts-flex-col ts-gap-1 ts-flex-1">
            <label className={`ts-text-sm ts-text-default ${isDisabled && 'ts-opacity-25'}`}>
              Position
            </label>
            <Select
              testId={'desktopPositionl'}
              id={'desktopPositionl'}
              placeholder={phrasesByKey.global_placeholder_channel}
              defaultValue={
                trustbadgeDataChild.attributes &&
                trustbadgeDataChild.attributes['data-desktop-position'] &&
                trustbadgeDataChild.attributes['data-desktop-position'].value
                  ? placementPhrase[
                      trustbadgeDataChild.attributes['data-desktop-position'].value?.toString()
                    ]
                  : null
              }
              disabled={isDisabled}
            >
              {Object.keys(PlacementDesktop).map(item => (
                <Option
                  testId={`desktopPositionl_${PlacementDesktop[item]}`}
                  id={`desktopPositionl_${PlacementDesktop[item]}`}
                  key={PlacementDesktop[item]}
                  value={PlacementDesktop[item]}
                  selected={Boolean(
                    trustbadgeDataChild.attributes &&
                      trustbadgeDataChild.attributes['data-desktop-position'] &&
                      PlacementDesktop[item] ===
                        trustbadgeDataChild.attributes['data-desktop-position'].value
                  )}
                  changeSelectedOption={value => {
                    updateTrustbadgeData({
                      'data-desktop-position': {
                        value,
                        attributeName: 'data-desktop-position',
                      },
                    })
                  }}
                >
                  <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm">
                    {placementPhrase[PlacementDesktop[item]]}
                  </p>
                </Option>
              ))}
            </Select>
          </div>
          <div className="ts-flex ts-flex-col ts-gap-1 ts-flex-1">
            <label className={`ts-text-sm ts-text-default ${isDisabled && 'ts-opacity-25'}`}>
              Vertical offset (px)
            </label>
            <NumberInput
              id={'desktop-y-offset'}
              min={-54}
              max={999}
              value={
                trustbadgeDataChild.attributes &&
                trustbadgeDataChild.attributes['data-desktop-y-offset']
                  ? trustbadgeDataChild.attributes['data-desktop-y-offset'].value?.toString()
                  : ''
              }
              disabled={isDisabled}
              onChange={value => {
                updateTrustbadgeData({
                  'data-desktop-y-offset': {
                    value: +value,
                    attributeName: 'data-desktop-y-offset',
                  },
                })
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile section */}
      <div>
        <div className="ts-flex ts-items-center ts-gap-2 ts-mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3.5" y="1.5" width="9" height="13" rx="1.5" stroke="#374151" stroke-width="1.2" fill="none" />
            <path d="M6.5 12.5H9.5" stroke="#374151" stroke-width="1.2" stroke-linecap="round" />
          </svg>
          <span className={`ts-text-sm ts-font-bold ts-text-default ${isDisabled && 'ts-opacity-25'}`}>
            Mobile
          </span>
        </div>
        <div className="ts-flex ts-items-center ts-gap-6">
          <div className="ts-flex ts-flex-col ts-gap-1 ts-flex-1">
            <label className={`ts-text-sm ts-text-default ${isDisabled && 'ts-opacity-25'}`}>
              Position
            </label>
            <Select
              testId={'mobilePositionl'}
              id={'mobilePositionl'}
              placeholder={phrasesByKey.global_placeholder_channel}
              defaultValue={
                trustbadgeDataChild.attributes &&
                trustbadgeDataChild.attributes['data-mobile-position'] &&
                trustbadgeDataChild.attributes['data-mobile-position'].value
                  ? placementPhrase[
                      trustbadgeDataChild.attributes['data-mobile-position'].value?.toString()
                    ]
                  : null
              }
              disabled={isDisabled}
            >
              {Object.keys(PlacementMobile).map(item => (
                <Option
                  testId={`mobilePositionl_${PlacementDesktop[item]}`}
                  id={`mobilePositionl_${PlacementDesktop[item]}`}
                  key={PlacementMobile[item]}
                  value={PlacementMobile[item]}
                  selected={Boolean(
                    trustbadgeDataChild.attributes &&
                      trustbadgeDataChild.attributes['data-mobile-position'] &&
                      PlacementMobile[item] ===
                        trustbadgeDataChild.attributes['data-mobile-position'].value
                  )}
                  changeSelectedOption={value => {
                    updateTrustbadgeData({
                      'data-mobile-position': {
                        value,
                        attributeName: 'data-mobile-position',
                      },
                    })
                  }}
                >
                  <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm">
                    {placementPhrase[PlacementMobile[item]]}
                  </p>
                </Option>
              ))}
            </Select>
          </div>
          <div className="ts-flex ts-flex-col ts-gap-1 ts-flex-1">
            <label className={`ts-text-sm ts-text-default ${isDisabled && 'ts-opacity-25'}`}>
              Vertical offset (px)
            </label>
            <NumberInput
              id={'mobile-y-offset'}
              min={-10}
              max={999}
              value={
                trustbadgeDataChild.attributes &&
                trustbadgeDataChild.attributes['data-mobile-y-offset']
                  ? trustbadgeDataChild.attributes['data-mobile-y-offset'].value?.toString()
                  : ''
              }
              disabled={isDisabled}
              onChange={value => {
                updateTrustbadgeData({
                  'data-mobile-y-offset': {
                    value: +value,
                    attributeName: 'data-mobile-y-offset',
                  },
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StandartEditor
