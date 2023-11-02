import { h } from 'preact'
import { FC } from 'preact/compat'
import Switch from '@/components/controls/switch'

import marketingImg from '@/assets/marketing-trustbadge-en.svg'
import TrustbadgeImg from '@/assets/Illustration-Trustbadge.svg'
import { selectorTrustbadgeState } from '@/store/selector'
import { DASHBOARD_KEYS } from '@/locales/types'
import useStore from '@/store/useStore'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  handleSwitch: any
}

const TrustBadgeSwitcher: FC<Props> = ({ phrasesByKey, handleSwitch }) => {
  const { trustbadgeId, trustbadgeDataChild } = useStore(selectorTrustbadgeState)

  return (
    <div>
      <div className="ts-w-full ts-flex ts-gap-8">
        <div className="ts-min-w-20 ts-h-20">
          <img className="ts-w-20 ts-h-20" src={TrustbadgeImg} alt="Trustbadge" />
        </div>
        <div className="ts-w-[calc(100%-112px)]">
          <div className="ts-flex ts-items-center ts-justify-between">
            <p className="ts-text-default ts-text-md ts-font-bold">
              {phrasesByKey.application_trustbadge_titel}
            </p>
            <Switch
              id={'trustBadge'}
              isToggle={
                trustbadgeDataChild.attributes &&
                trustbadgeDataChild.attributes['data-disable-trustbadge']
                  ? (!trustbadgeDataChild.attributes['data-disable-trustbadge'].value as boolean)
                  : false
              }
              disabled={!trustbadgeId}
              setIsToggle={handleSwitch}
              labelOn={phrasesByKey?.global_slider_active}
              labelOff={phrasesByKey?.global_slider_inactive}
            />
          </div>
          <p className="ts-text-default ts-text-sm ts-font-bold ts-mt-6">
            {phrasesByKey?.application_trustbadge_subtitel}
          </p>
          <p className="ts-text-default ts-text-sm ts-mt-4">
            {phrasesByKey?.application_trustbadge_description}
          </p>
        </div>
      </div>
      <div className="ts-flex ts-justify-center ts-py-8">
        <img src={marketingImg} alt="marketing" />
      </div>
    </div>
  )
}

export default TrustBadgeSwitcher
