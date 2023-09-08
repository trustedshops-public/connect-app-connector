import { h } from 'preact'
import { FC, useEffect, useState } from 'preact/compat'

import TextWithLink from '@/components/layouts/textWithLink'
import timeIcon from '@/assets/invites-tab-time-icon.svg'
import { DASHBOADR_KEYS } from '@/locales/types'
import Button, { ButtonThemes } from '@/components/controls/buttun'
import { Option, Select } from '@/components/controls/dropdown'
import useStore from '@/store/useStore'
import { selectorInfoOfSystem, selectorReviewInvites } from '@/store/selector'
import infoIcon from '@/assets/settings-tab-warn-icon.svg'
import _ from 'lodash'

interface Props {
  phrasesByKey: DASHBOADR_KEYS
  saveChanges: () => void
}

const SendReviewInvitesRightTime: FC<Props> = ({ phrasesByKey, saveChanges }) => {
  const { availableOrderStatusesAction, selectedReviews, initialSelectedReviews } =
    useStore(selectorReviewInvites)
  const { setSelectedReviews } = useStore()

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  useEffect(() => {
    setIsButtonDisabled(_.isEqual(selectedReviews, initialSelectedReviews))
  }, [selectedReviews, initialSelectedReviews])

  return (
    <div className="ts-p-8 ts-w-full ts-flex ts-flex-col ts-items-end ts-bg-white ts-shadow-md ts-rounded first:ts-rounded-t-none">
      <div className="ts-w-full ts-flex ts-gap-8">
        <div className="ts-min-w-20 ts-h-20">
          <img className="ts-w-20 ts-h-20" src={timeIcon} alt="tab-icon" />
        </div>

        <div className="ts-w-[calc(100%-112px)]">
          <p className="ts-text-default ts-text-md ts-font-bold ts-mb-8">
            {phrasesByKey.application_invites_sendbyos_title}
          </p>
          <div className="ts-flex">
            <p className="ts-text-default ts-text-sm ts-mb-4">
              {phrasesByKey.application_invites_sendbyos_description}
            </p>
            <img className="ts-w-[22px] ts-h-[22px] ts-ml-1" src={infoIcon} alt="info-icon" />
          </div>
          <div className="ts-flex ts-flex-col ts-gap-2 ts-mt-8">
            <div className="ts-relative ts-flex ts-items-center ts-justify-center ts-mb-8">
              <div className="ts-absolute ts-left-0 ts-flex ts-items-center ts-w-statusSelected">
                <label
                  className={`${'ts-text-durkLabel'} ts-whitespace-nowrap ts-mr-4 ts-font-normal ts-text-sm`}
                >
                  {phrasesByKey.application_invites_sendbyos_type_serviceReviews}
                </label>
                <Select
                  id={'channelSelection'}
                  placeholder="Choose an option"
                  defaultValue={
                    availableOrderStatusesAction.find(i => i.ID === selectedReviews.service?.ID)
                      ?.name || ''
                  }
                  className="ts-w-[171px]"
                  // disabled={!mappedChannels.length}
                >
                  {availableOrderStatusesAction.map(item => (
                    <Option
                      id={`channel`}
                      key={item.ID}
                      value={'ID'}
                      changeSelectedOption={() => setSelectedReviews({ service: item })}
                    >
                      <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm">
                        {item.name}
                      </p>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {infoOfSystem.allowsSendReviewInvitesForProduct && (
              <div className="ts-flex ts-items-center ts-justify-center ts-mb-8">
                <div className="ts-flex ts-items-center ts-w-statusSelected">
                  <label
                    className={`${'ts-text-durkLabel'} ts-whitespace-nowrap ts-mr-4 ts-font-normal ts-text-sm`}
                  >
                    {phrasesByKey.application_invites_sendbyos_type_productReviews}
                  </label>
                  <Select
                    id={'channelSelection'}
                    placeholder="Choose an option"
                    defaultValue={
                      availableOrderStatusesAction.find(i => i.ID === selectedReviews.product?.ID)
                        ?.name || ''
                    }
                    className="ts-w-[171px]"

                    // disabled={!mappedChannels.length}
                  >
                    {availableOrderStatusesAction.map(item => (
                      <Option
                        id={`channel`}
                        key={item.ID}
                        value={'ID'}
                        changeSelectedOption={() => setSelectedReviews({ product: item })}
                      >
                        <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm">
                          {item.name}
                        </p>
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="ts-w-[calc(100%-112px)] ts-ml-6">
                  <TextWithLink
                    id={'Upgrade now'}
                    url={phrasesByKey.application_invites_sendbyos_upgradedescription_url_1}
                    text={phrasesByKey.application_invites_sendbyos_upgradedescription_text}
                    textStyle="ts-text-default ts-text-sm"
                  />
                </div>
              </div>
            )}
            <div className="">
              <p className="ts-text-default ts-text-sm ts-mb-8">
                {phrasesByKey.application_invites_send_export_description}
              </p>
              <TextWithLink
                id={'Control Centre'}
                url={phrasesByKey.application_invites_sendbyos_success_delay_url_1}
                text={phrasesByKey.application_invites_sendbyos_success_delay_text}
                textStyle="ts-text-default ts-text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ts-w-full ts-mt-5 ts-flex ts-justify-end">
        <Button
          id={'saveReviewInvites'}
          label={phrasesByKey.global_button_submit}
          theme={ButtonThemes.Primary}
          onClick={saveChanges}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  )
}

export default SendReviewInvitesRightTime
