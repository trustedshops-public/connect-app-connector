import { h } from 'preact'
import { FC, useEffect, useState, useRef } from 'preact/compat'

import TextWithLink from '@/components/layouts/textWithLink'
import { InfoCircleOutlinedIcon } from '@/components/layouts/icons/InfoCircleOutlinedIcon'
import { Option, Select } from '@/components/controls/dropdown'
import useStore from '@/store/useStore'
import {
  selectAllState,
  selectorAuth,
  selectorInfoOfSystem,
  selectorReviewInvites,
} from '@/store/selector'
import { CHECKOUT_TYPE } from '@/store/reviewInvites/reviewInvitesSendActions'
import { DASHBOARD_KEYS } from '@/locales/types'
import { isEqual } from '@/utils'

import { IMappedChannel } from '@/baseLayers/types'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import { putEtrustedConfiguration } from '@/api/api'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  saveChanges: () => void
  selectedShopChannels: IMappedChannel
}

const SendReviewInvitesRightTime: FC<Props> = ({
  phrasesByKey,
  saveChanges,
  selectedShopChannels,
}) => {
  const { availableOrderStatusesAction, selectedReviews, initialSelectedReviews } =
    useStore(selectorReviewInvites)
  const { setSelectedReviews } = useStore()
  const servicelabelRef = useRef<HTMLLabelElement>(null)
  const productlabelRef = useRef<HTMLLabelElement>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const allState = useStore(selectAllState)
  const { user } = useStore(selectorAuth)

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
    availableOrderStatusesAction.find(i => i.ID === selectedReviews.service?.ID)?.name || '',
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
    <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-8" style={{ border: '1px solid #E5E7EB' }}>
      <h3 className="ts-text-default ts-font-bold ts-mb-2" style={{ fontSize: '15px' }}>
        {phrasesByKey.application_invites_sendbyos_title}
      </h3>
      <p className="ts-text-sm ts-font-normal ts-mb-6" style={{ color: '#6b7280' }}>
        {phrasesByKey.application_invites_sendbyos_description}
      </p>

      {/* Divider */}
      <div className="ts-w-full ts-mb-6" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

      {/* Service reviews */}
      <div className="ts-mb-5">
        <label
          ref={servicelabelRef}
          className="ts-text-default ts-font-bold ts-text-sm ts-mb-2 ts-block"
        >
          {phrasesByKey.application_invites_sendbyos_type_serviceReviews}
        </label>
        <Select
          testId={'channelSelection'}
          id={'channelSelection'}
          placeholder="Choose an option"
          defaultValue={
            defaulServicetValue.charAt(0).toUpperCase() + defaulServicetValue.slice(1)
          }
          className="ts-w-[280px] ts-capitalize"
          disabled={!selectedShopChannels.eTrustedChannelRef}
        >
          {availableOrderStatusesAction.map(item => (
            <Option
              testId={`channel`}
              id={`channel`}
              key={item?.ID}
              value={'ID'}
              selected={item?.ID?.toString() === selectedReviews?.service?.ID?.toString()}
              disabled={
                item?.ID?.toString() !== selectedReviews?.product?.ID?.toString() &&
                item?.ID?.toString() !== CHECKOUT_TYPE &&
                selectedReviews?.product?.ID?.toString() !== CHECKOUT_TYPE
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

      {/* Product reviews */}
      {infoOfSystem.allowsSendReviewInvitesForProduct && (
        <div className="ts-mb-6">
          <label
            ref={productlabelRef}
            className="ts-text-default ts-font-bold ts-text-sm ts-mb-2 ts-block"
          >
            {phrasesByKey.application_invites_sendbyos_type_productReviews}
          </label>
          <Select
            testId={'channelSelection'}
            id={'channelSelection'}
            placeholder="Choose an option"
            defaultValue={
              defaulProductValue.charAt(0).toUpperCase() + defaulProductValue.slice(1)
            }
            className="ts-w-[280px] ts-capitalize"
            disabled={!selectedShopChannels.eTrustedChannelRef}
          >
            {availableOrderStatusesAction.map(item => (
              <Option
                testId={`channel`}
                id={`channel`}
                key={item.ID}
                selected={item?.ID?.toString() === selectedReviews?.product?.ID?.toString()}
                value={'ID'}
                disabled={
                  item?.ID?.toString() !== selectedReviews?.service?.ID?.toString() &&
                  item?.ID?.toString() !== CHECKOUT_TYPE &&
                  selectedReviews?.service?.ID?.toString() !== CHECKOUT_TYPE
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
      )}

      {/* Info box */}
      <div
        className="ts-flex ts-items-center ts-gap-3 ts-p-4 ts-mb-6"
        style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #DBEAFE',
          borderRadius: '10px',
        }}
      >
        <InfoCircleOutlinedIcon size={20} customClass="ts-flex-shrink-0" />
        <div>
          <TextWithLink
            id={'Control Centre'}
            url={phrasesByKey.application_invites_sendbyos_success_delay_url_1}
            text={phrasesByKey.application_invites_sendbyos_success_delay_text}
            textStyle="ts-text-sm"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="ts-w-full ts-mb-6" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

      {/* Save button */}
      <div className="ts-flex ts-justify-end">
        <button
          id="saveReviewInvites"
          data-testid="saveReviewInvites"
          type="button"
          onClick={() => {
            saveChanges()
            handleEtrustedConfiguration(
              user?.access_token,
              allState,
              'invites',
              putEtrustedConfiguration,
            )
          }}
          disabled={isButtonDisabled}
          className="ts-text-white ts-text-sm ts-font-bold ts-px-6 ts-py-2 ts-border-0 ts-cursor-pointer disabled:ts-opacity-50 disabled:ts-cursor-not-allowed"
          style={{
            background: 'linear-gradient(180deg, #1c8dc6 0%, #005aa0 100%)',
            borderRadius: '4px',
            height: '36px',
          }}
        >
          {phrasesByKey.global_button_save}
        </button>
      </div>
    </div>
  )
}

export default SendReviewInvitesRightTime
