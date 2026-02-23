import { h } from 'preact'
import { FC } from 'preact/compat'

import TextWithLink from '@/components/layouts/textWithLink'
import { ChevronRightSmallIcon } from '@/components/layouts/icons/ChevronRightSmallIcon'
import { InfoCircleFilledIcon } from '@/components/layouts/icons/InfoCircleFilledIcon'
import { DASHBOARD_KEYS } from '@/locales/types'
import { IMappedChannel } from '@/baseLayers/types'
import useStore from '@/store/useStore'
import { selectAllState, selectorAuth } from '@/store/selector'
import { ActionTypes, postEtrustedInteractions } from '@/api/api'
import { handleEtrustedInteraction } from '@/utils/configurationDataHandler'

interface Props {
  phrasesByKey: DASHBOARD_KEYS
  numberOfDays: number
  changeNumberOfDays: (v: number) => void
  onExport: (payload: { id: string; salesChannelRef: string; includeProductData: boolean }) => void
  selectedShopChannels: IMappedChannel
  isToggle: boolean
  handleToggle: () => void
}

const SendReviewInvitesForPreviousOrders: FC<Props> = ({
  phrasesByKey,
  selectedShopChannels,
  numberOfDays,
  changeNumberOfDays,
  onExport,
  isToggle,
  handleToggle,
}) => {
  const allState = useStore(selectAllState)
  const { user } = useStore(selectorAuth)

  return (
    <div className="ts-bg-white ts-rounded-[14px] ts-shadow-md ts-p-8" style={{ border: '1px solid #E5E7EB' }}>
      <h3 className="ts-text-default ts-font-bold ts-mb-2" style={{ fontSize: '15px' }}>
        {phrasesByKey.application_invites_send_export_title}
      </h3>
      <p className="ts-text-sm ts-font-normal ts-mb-6" style={{ color: '#6b7280', maxWidth: '80%' }}>
        {phrasesByKey.application_invites_send_export_description}
      </p>

      {/* Divider */}
      <div className="ts-w-full ts-mb-6" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

      {/* Step 1 */}
      <p className="ts-text-default ts-text-sm ts-font-bold ts-mb-3">
        Step 1: Export orders
      </p>

      <p className="ts-text-default ts-text-sm ts-mb-3">
        Export orders made in the past
      </p>

      {/* Number input on its own row */}
      <div className="ts-flex ts-items-center ts-gap-3 ts-mb-5">
        <div
          className="ts-flex ts-items-center"
          style={{
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '40px',
            width: '130px',
          }}
        >
          <input
            id="number_numberOfDays"
            type="number"
            value={numberOfDays}
            onChange={(e: any) => {
              const v = Math.min(90, Math.max(0, Number(e.target.value)))
              changeNumberOfDays(v)
            }}
            disabled={!selectedShopChannels.eTrustedChannelRef}
            className="ts-border-0 ts-text-sm ts-text-default"
            style={{
              width: '98px',
              height: '100%',
              padding: '0 10px',
              outline: 'none',
              appearance: 'textfield',
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              backgroundColor: '#FFFFFF',
            }}
          />
          <div
            className="ts-flex ts-flex-col ts-h-full"
            style={{ borderLeft: '1px solid #D1D5DB' }}
          >
            <button
              type="button"
              disabled={!selectedShopChannels.eTrustedChannelRef}
              onClick={() => changeNumberOfDays(Math.min(90, numberOfDays + 1))}
              className="ts-flex ts-items-center ts-justify-center ts-bg-white ts-border-0 ts-cursor-pointer hover:ts-bg-gray-50"
              style={{ width: '30px', flex: 1, borderBottom: '1px solid #D1D5DB', fontSize: '12px', color: '#374151', lineHeight: 0 }}
            >
              +
            </button>
            <button
              type="button"
              disabled={!selectedShopChannels.eTrustedChannelRef}
              onClick={() => changeNumberOfDays(Math.max(0, numberOfDays - 1))}
              className="ts-flex ts-items-center ts-justify-center ts-bg-white ts-border-0 ts-cursor-pointer hover:ts-bg-gray-50"
              style={{ width: '30px', flex: 1, fontSize: '12px', color: '#374151', lineHeight: 0 }}
            >
              −
            </button>
          </div>
        </div>
        <p className="ts-text-default ts-text-sm" style={{ color: '#6b7280' }}>days</p>
      </div>

      {/* Include product data toggle */}
      <div
        className="ts-flex ts-items-center ts-justify-between ts-mb-5"
        style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          padding: '17px',
          border: '1px solid #E5E7EB',
          maxWidth: '360px',
        }}
      >
        <p className="ts-text-default ts-text-sm">
          {phrasesByKey.application_invites_sendbyos_export_productdata}
        </p>
        <button
          type="button"
          onClick={() => {
            if (!selectedShopChannels.eTrustedChannelRef) return
            handleToggle()
          }}
          className="ts-border-0 ts-p-0 ts-cursor-pointer ts-flex-shrink-0 ts-ml-4"
          style={{
            width: '36px',
            height: '20px',
            borderRadius: '10px',
            backgroundColor: isToggle ? '#16A34A' : '#D1D5DB',
            position: 'relative',
            transition: 'background-color 0.2s ease',
            opacity: !selectedShopChannels.eTrustedChannelRef ? 0.25 : 1,
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              position: 'absolute',
              top: '2px',
              left: isToggle ? '18px' : '2px',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
            }}
          />
        </button>
      </div>

      {/* Export button - blue text, gray background */}
      <button
        id="exportCSV"
        data-testid="exportCSV"
        type="button"
        onClick={() => {
          onExport({
            id: selectedShopChannels?.eTrustedChannelRef,
            salesChannelRef: selectedShopChannels.salesChannelRef,
            includeProductData: isToggle,
          })
          handleEtrustedInteraction(
            user?.access_token,
            allState,
            ActionTypes.DATA_EXPORTED,
            'invites',
            postEtrustedInteractions,
          )
        }}
        disabled={!selectedShopChannels.eTrustedChannelRef}
        className="ts-text-sm ts-font-medium ts-px-4 ts-py-1.5 ts-cursor-pointer ts-mb-6 disabled:ts-opacity-50 disabled:ts-cursor-not-allowed"
        style={{
          color: '#005AA0',
          background: 'linear-gradient(180deg, #F7F7F7 0%, #F5F5F5 8.85%, #E8E8E8 100%)',
          border: '1px solid #CCC',
          borderRadius: '4px',
        }}
      >
        {phrasesByKey.application_invites_send_export_button}
      </button>

      {/* Divider */}
      <div className="ts-w-full ts-mb-6" style={{ height: '1px', backgroundColor: '#E5E7EB' }} />

      {/* Step 2 */}
      <p className="ts-text-default ts-text-sm ts-font-bold ts-mb-3">
        Step 2: Upload orders
      </p>

      <div className="ts-mb-3">
        <TextWithLink
          id={'send_export_description'}
          url={[
            phrasesByKey.application_invites_send_export_step_2_description_url_1,
            phrasesByKey.application_invites_send_export_step_2_description_url_2,
          ]}
          text={phrasesByKey.application_invites_send_export_step_2_description_text}
          textStyle="ts-text-default ts-text-sm"
        />
      </div>

      {/* Send manual invites link - smaller, blue with arrow */}
      <a
        href={phrasesByKey.application_invites_send_export_step_2_description_url_2}
        target="_blank"
        rel="noopener noreferrer"
        className="ts-inline-flex ts-items-center ts-gap-1 ts-font-normal ts-mb-6"
        style={{ color: '#2563EB', textDecoration: 'none', fontSize: '13px' }}
      >
        Send manual invites
        <ChevronRightSmallIcon />
      </a>

      {/* Info box - dark filled circle icon, underlined link */}
      <div
        className="ts-flex ts-items-start ts-gap-3 ts-p-4"
        style={{
          backgroundColor: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
        }}
      >
        {/* Filled dark info icon */}
        <InfoCircleFilledIcon customClass="ts-flex-shrink-0 ts-mt-0.5" />
        <p className="ts-text-sm ts-font-normal" style={{ color: '#4B5563' }}>
          If you do not want to collect reviews automated or if you want to manually invite customers to submit reviews in addition to the automated dispatch of invites, you can use the{' '}
          <a
            href={phrasesByKey.application_invites_send_export_help_url_1}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563EB', textDecoration: 'underline' }}
          >
            Review Collector
          </a>.
        </p>
      </div>
    </div>
  )
}

export default SendReviewInvitesForPreviousOrders
