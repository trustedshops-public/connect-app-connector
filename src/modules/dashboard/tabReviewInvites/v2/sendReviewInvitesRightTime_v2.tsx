import { h } from 'preact'
import { FC, useEffect, useState, useRef } from 'preact/compat'

import TextWithLink from '@/components/layouts/textWithLink'
import Button, { ButtonThemes } from '@/components/controls/buttun'
import { Option, Select } from '@/components/controls/dropdown'
import useStore from '@/store/useStore'
import { selectorInfoOfSystem, selectorReviewInvites } from '@/store/selector'
import { CHECKOUT_TYPE } from '@/store/reviewInvites/reviewInvitesSendActions'
import { DASHBOARD_KEYS } from '@/locales/types'
import { isEqual } from '@/utils'

import infoIcon from '@/assets/settings-tab-warn-icon.svg'
import warnIcon from '@/assets/warning-sign.svg'
import timeIcon from '@/assets/invites-tab-time-icon.svg'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  saveChanges: () => void
}

const SendReviewInvitesRightTime: FC<Props> = ({ phrasesByKey, saveChanges }) => {
  const { availableOrderStatusesAction, selectedReviews, initialSelectedReviews } =
    useStore(selectorReviewInvites)
  const { setSelectedReviews } = useStore()
  const servicelabelRef = useRef<HTMLLabelElement>(null)
  const productlabelRef = useRef<HTMLLabelElement>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)

  useEffect(() => {
    setIsButtonDisabled(isEqual(selectedReviews, initialSelectedReviews))
  }, [selectedReviews, initialSelectedReviews])

  const isSelectedReviewCheckout =
    (selectedReviews && selectedReviews?.product?.name !== CHECKOUT_TYPE) ||
    selectedReviews?.service?.name !== CHECKOUT_TYPE

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const defaulServicetValue = capitalizeFirstLetter(
    availableOrderStatusesAction.find(i => i.ID === selectedReviews.service?.ID)?.name || ''
  )

  const defaulProductValue =
    availableOrderStatusesAction.find(i => i.ID === selectedReviews.product?.ID)?.name || ''

  useEffect(() => {
    const adjustLabelWidth = () => {
      if (servicelabelRef.current && productlabelRef.current) {
        const label1Width = servicelabelRef.current.offsetWidth
        const label2Width = productlabelRef.current.offsetWidth

        const biggerWidth = Math.max(label1Width, label2Width)

        servicelabelRef.current.style.width = `${biggerWidth}px`
        productlabelRef.current.style.width = `${biggerWidth}px`
      }
    }
    adjustLabelWidth()
  }, [])

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
          <div className="ts-flex ts-items-center">
            <p className="ts-text-default ts-text-sm">
              {phrasesByKey.application_invites_sendbyos_description}
            </p>
            <img className="ts-w-[22px] ts-h-[22px] ts-ml-2" src={infoIcon} alt="info-icon" />
          </div>
          <div className="ts-flex ts-flex-col ts-gap-2 ts-mt-6">
            <div className="ts-relative ts-flex ts-items-center ts-mb-3">
              <div className="ts-left-0 ts-flex ts-items-center">
                <label
                  ref={servicelabelRef}
                  className={`${'ts-text-darkLabel'} ts-whitespace-nowrap ts-mr-4 ts-font-normal ts-text-sm`}
                >
                  {phrasesByKey.application_invites_sendbyos_type_serviceReviews}
                </label>
                <Select
                  id={'channelSelection'}
                  placeholder="Choose an option"
                  defaultValue={
                    defaulServicetValue.charAt(0).toUpperCase() + defaulServicetValue.slice(1)
                  }
                  className="ts-w-[171px] ts-capitalize"
                >
                  {availableOrderStatusesAction.map(item => (
                    <Option
                      id={`channel`}
                      key={item.ID}
                      value={'ID'}
                      selected={item.ID === selectedReviews?.service?.ID}
                      disabled={
                        item.ID !== selectedReviews?.product?.ID &&
                        item.ID !== CHECKOUT_TYPE &&
                        selectedReviews?.product?.ID !== CHECKOUT_TYPE
                      }
                      changeSelectedOption={() => {
                        setSelectedReviews({ service: item })
                      }}
                    >
                      <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm ts-capitalize">
                        {item.name}
                      </p>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            {infoOfSystem.allowsSendReviewInvitesForProduct && (
              <div className="ts-flex ts-items-center ts-justify-center">
                <div className="ts-flex ts-items-center">
                  <label
                    ref={productlabelRef}
                    className="ts-text-darkLabel ts-whitespace-nowrap ts-mr-4 ts-font-normal ts-text-sm"
                  >
                    {phrasesByKey.application_invites_sendbyos_type_productReviews}
                  </label>
                  <Select
                    id={'channelSelection'}
                    placeholder="Choose an option"
                    defaultValue={
                      defaulProductValue.charAt(0).toUpperCase() + defaulProductValue.slice(1)
                    }
                    className="ts-w-[171px] ts-capitalize"
                  >
                    {availableOrderStatusesAction.map(item => (
                      <Option
                        id={`channel`}
                        key={item.ID}
                        selected={item.ID === selectedReviews?.product?.ID}
                        value={'ID'}
                        disabled={
                          item.ID !== selectedReviews?.service?.ID &&
                          item.ID !== CHECKOUT_TYPE &&
                          selectedReviews?.service?.ID !== CHECKOUT_TYPE
                        }
                        changeSelectedOption={() => setSelectedReviews({ product: item })}
                      >
                        <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm ts-capitalize">
                          {item.name}
                        </p>
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="ts-w-[calc(100%-112px)] ts-ml-6">
                  <TextWithLink
                    id={'contact our sales team'}
                    url={phrasesByKey.application_invites_sendbyos_upgradedescription_url_1}
                    text={phrasesByKey.application_invites_sendbyos_upgradedescription_text}
                    textStyle="ts-text-default ts-text-sm"
                  />
                </div>
              </div>
            )}
            <div className="ts-mt-4">
              {isSelectedReviewCheckout && (
                <div className="ts-flex ts-items-start ts-mb-4">
                  <img className="ts-mr-1" src={warnIcon} alt="warn-icon" />
                  <TextWithLink
                    id={'orderstatus_warning_text'}
                    url={[
                      phrasesByKey.application_invites_sendbyos_orderstatus_warning_url_1,
                      phrasesByKey.application_invites_sendbyos_orderstatus_warning_url_2,
                    ]}
                    text={phrasesByKey.application_invites_sendbyos_orderstatus_warning_text}
                    textStyle="ts-tracking-tight ts-text-default ts-text-sm ts-italic"
                  />
                </div>
              )}
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
          label={phrasesByKey.global_button_save}
          theme={ButtonThemes.Primary}
          onClick={saveChanges}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  )
}

export default SendReviewInvitesRightTime
