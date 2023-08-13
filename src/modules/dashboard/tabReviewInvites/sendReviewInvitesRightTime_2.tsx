import { h } from 'preact'
import { FC, useEffect, useState } from 'preact/compat'

import TextWithLink, { TextWithBold } from '@/components/layouts/textWithLink'
import timeIcon from '@/assets/invites-tab-time-icon.svg'
import { DASHBOADR_KEYS } from '@/locales/types'
import { IMappedChannel } from '@/baseLayers/types'
import Button, { ButtonThemes } from '@/components/controls/buttun'
import { Option, Select } from '@/components/controls/dropdown'
import useStore from '@/store/useStore'
import { selectorInfoOfSystem } from '@/store/selector'
import infoIcon from '@/assets/info_icon.svg'
import _ from 'lodash'

interface Props {
  phrasesByKey: DASHBOADR_KEYS
  saveChanges: () => void
  changeUseTimeOfSendReviewInvites: (v: {
    isEstimatedDeliveryDate: boolean
    isEventsByOrderStatusShipped: boolean
  }) => void
  selectedShopChannels: IMappedChannel
  typesReviewInvites: {
    isEstimatedDeliveryDate: boolean
    isEventsByOrderStatusShipped: boolean
  }
  initialDateToSendReviewInvites: {
    isEstimatedDeliveryDate: boolean
    isEventsByOrderStatusShipped: boolean
  }
  isMappedTypesErorr: boolean
  showProductReviews: boolean
}

const defaultStatus = {
  name: 'Checkout',
  ID: 'Checkout', // You might want to use a unique ID here, like a string
  event_type: 'Checkout',
}

const DEVStatuses = [
  defaultStatus,
  { name: 'Awaiting Payment', ID: 1, event_type: 'Awaiting Payment' },
  { name: 'Payment accepted', ID: 2, event_type: 'Payment accepted' },
  { name: 'Processing in progress', ID: 3, event_type: 'Processing in progress' },
  { name: 'Shipped', ID: 4, event_type: 'Shipped' },
  { name: 'Delivered', ID: 5, event_type: 'Delivered' },
  { name: 'Canceled', ID: 6, event_type: 'Canceled' },
  { name: 'Refunded', ID: 7, event_type: 'Refunded' },
]
const SendReviewInvitesRightTime: FC<Props> = ({
  phrasesByKey,
  saveChanges,
  changeUseTimeOfSendReviewInvites,
  selectedShopChannels,
  initialDateToSendReviewInvites,
  typesReviewInvites,
  isMappedTypesErorr,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const [serviceReviews, setServiceReviews] = useState(DEVStatuses[0].event_type)
  const [productReviews, setProductReviews] = useState(DEVStatuses[0].event_type)
  const store = useStore()
  useEffect(() => {
    setIsButtonDisabled(_.isEqual(typesReviewInvites, initialDateToSendReviewInvites))
  }, [typesReviewInvites, initialDateToSendReviewInvites])

  const onChangeServicereviews = (eventType: string) => {
    setServiceReviews(eventType)
  }

  const onChangeProductreviews = (eventType: string) => {
    setProductReviews(eventType)
  }
  return (
    <div className="ts-p-8 ts-w-full ts-flex ts-flex-col ts-items-end ts-bg-white ts-shadow-md ts-rounded first:ts-rounded-t-none">
      <div className="ts-w-full ts-flex ts-gap-8">
        <div className="ts-min-w-20 ts-h-20">
          <img className="ts-w-20 ts-h-20" src={timeIcon} alt="tab-icon" />
        </div>

        <div className="ts-w-[calc(100%-112px)]">
          <p className="ts-text-default ts-text-md ts-font-bold ts-mb-8">
            {phrasesByKey.application_invites_send_title}
          </p>
          <div className="ts-flex">
            <p className="ts-text-default ts-text-sm ts-mb-4">
              {phrasesByKey.application_invites_send_export_description}
            </p>
            <img className="ts-w-[22px] ts-h-[22px] ts-ml-1" src={infoIcon} alt="info-icon" />
          </div>
          <div className="ts-flex ts-flex-col ts-gap-2 ts-mt-8">
            <div className="ts-relative ts-flex ts-items-center ts-justify-center ts-mb-8">
              <div className="ts-absolute ts-left-0 ts-flex ts-items-center ts-w-statusSelected">
                <label
                  className={`${'ts-text-durkLabel'} ts-whitespace-nowrap ts-mr-4 ts-font-normal ts-text-sm`}
                >
                  Service reviews:
                </label>
                <Select
                  id={'channelSelection'}
                  placeholder="Choose an option"
                  defaultValue={serviceReviews}
                  className="ts-w-[171px]"
                  // disabled={!mappedChannels.length}
                >
                  {DEVStatuses.map(({ ID, event_type }) => (
                    <Option
                      id={`channel`}
                      key={'ID'}
                      value={'ID'}
                      changeSelectedOption={() => onChangeServicereviews(event_type)}
                    >
                      <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm">
                        {event_type}
                      </p>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="ts-flex ts-items-center ts-justify-center ts-mb-8">
              <div className="ts-flex ts-items-center ts-w-statusSelected">
                <label
                  className={`${'ts-text-durkLabel'} ts-whitespace-nowrap ts-mr-4 ts-font-normal ts-text-sm`}
                >
                  Product reviews:
                </label>
                <Select
                  id={'channelSelection'}
                  placeholder="Choose an option"
                  defaultValue={productReviews}
                  className="ts-w-[171px]"
                  // disabled={!mappedChannels.length}
                >
                  {DEVStatuses.map(({ event_type }) => (
                    <Option
                      id={`channel`}
                      key={'event_type'}
                      value={'event_type'}
                      changeSelectedOption={() => onChangeProductreviews(event_type)}
                    >
                      <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm">
                        {event_type}
                      </p>
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="ts-w-[calc(100%-112px)] ts-ml-6">
                <TextWithLink
                  id={'Upgrade now'}
                  url={phrasesByKey.application_invites_send_export_help_url_1}
                  text={phrasesByKey.application_invites_send_export_title}
                  textStyle="ts-text-default ts-text-xs"
                />
              </div>
            </div>
            <div className="">
              <p className="ts-text-default ts-text-sm ts-mb-8">
                {phrasesByKey.application_invites_send_export_description}
              </p>
              <TextWithLink
                id={'Control Centre'}
                url={phrasesByKey.application_invites_send_export_help_url_1}
                text={phrasesByKey.application_invites_send_export_help_text}
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
          // disabled={!selectedShopChannels.eTrustedChannelRef || isButtonDisabled}
        />
      </div>
    </div>
  )
}

export default SendReviewInvitesRightTime
