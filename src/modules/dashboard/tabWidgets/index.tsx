import { h, Fragment } from 'preact'
import { FC } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import CreateWidgetPopup from './createWidgetPopup'
import WidgetRow from './widgetRow'
import { dispatchAction, EVENTS } from '@/eventsLib'
import Spinner, { ScrinSpinner } from '@/components/layouts/spinner'
import { WidgetChildren } from '@/store/widgets/types'
import { IWidgets } from '@/baseLayers/types'
import { isEqual } from '@/utils'
import useStore from '@/store/useStore'
import { selectAllState, selectorAuth, selectorChannels, selectorInfoOfSystem } from '@/store/selector'
import { TabProps } from '@/modules/type'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'

const ATTRIBUTE_OPTIONS = [
  { id: 'data-sku', name: 'SKU' },
  { id: 'data-gtin', name: 'GTIN' },
  { id: 'data-mpn', name: 'MPN' },
]

const WidgetsTab: FC<TabProps> = ({ phrasesByKey }) => {
  const [modalIsOpen, setOpenModal] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [widgetsWithoutProductId, setWidgetsWithoutProductId] = useState<WidgetChildren[]>([])
  const [availableProducts, setAvailableProducts] = useState<{ id: string; name: string }[]>([])

  const { selectedShopChannels } = useStore(selectorChannels)

  const { setisWidgetLoading, addInToastList } = useStore()
  const {
    isLoading,
    widgets,
    widgetsChildren,
    widgetsFromBL,
    widgetsFromAPI,
    isWidgetLoading,
    availableProductIds,
  } = useStore(state => state.widgetState)
  const allState = useStore(selectAllState)
  const { user } = useStore(selectorAuth)
  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const allowsTrustedCheckoutWidget = !!infoOfSystem?.allowsTrustedCheckoutWidget
  useEffect(() => {
    const widgetsChildrenFiltred = widgetsChildren.filter(
      (widget: WidgetChildren) => widget.widgetLocation?.id,
    )
    if (!widgetsFromBL || !widgetsFromBL.children || !widgetsFromBL.children.length) {
      setIsButtonDisabled(!widgetsChildrenFiltred.length)
      return
    }
    const isEqualRB = isEqual(widgetsChildrenFiltred, widgetsFromBL.children[0].children)
    setIsButtonDisabled(isEqualRB)
  }, [widgetsChildren, widgetsFromBL])

  useEffect(() => {
    const products = availableProductIds.length
      ? ATTRIBUTE_OPTIONS.filter(option => availableProductIds.some(prod => prod.id === option.id))
      : ATTRIBUTE_OPTIONS

    setAvailableProducts(products)
  }, [availableProductIds])

  const handleSaveChanges = () => {
    const copyWidgets = JSON.parse(JSON.stringify(widgets)) as IWidgets
    const widgetsWithoutPId: WidgetChildren[] = []
    copyWidgets.children[0].children.forEach(
      (widget: WidgetChildren) => {
        if (widget.widgetLocation?.id) {
          if (widget.attributes?.productIdentifier?.attributeName === '') {
            widgetsWithoutPId.push(widget)
          }
        }
      },
    )
    if (widgetsWithoutPId.length) {
      setWidgetsWithoutProductId(widgetsWithoutPId)
      addInToastList({
        status: 'error',
        type: 'productIdUnselected',
      })
      return
    }
    setisWidgetLoading(true)
    dispatchAction({
      action: EVENTS.SAVE_WIDGET_CHANGES,
      payload: {
        ...copyWidgets,
        id: selectedShopChannels.eTrustedChannelRef,
        eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
        salesChannelRef: selectedShopChannels.salesChannelRef,
      },
    })

    handleEtrustedConfiguration(user?.access_token, allState, 'widgets', putEtrustedConfiguration)
  }

  return (
    <div className="ts-flex ts-flex-col ts-gap-6">
      {isWidgetLoading && <ScrinSpinner />}

      {isLoading ? (
        <div className="ts-flex ts-flex-col ts-items-center ts-justify-center ts-h-96">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Card 1: Widgets header */}
          <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md ts-p-8">
            <h2 className="ts-text-default ts-text-lg ts-font-bold ts-mb-2">
              {phrasesByKey.application_widgets_title}
            </h2>
            <p className="ts-text-sm ts-font-normal" style={{ color: '#6b7280' }}>
              {phrasesByKey.application_widgets_description}
            </p>
          </div>

          {/* Card 2: Widget table */}
          <div className="ts-bg-white ts-rounded-[16px] ts-shadow-md">
            {/* Table header */}
            <div
              className="ts-flex ts-px-6 ts-items-center ts-w-full ts-py-3"
              style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', borderRadius: '16px 16px 0 0' }}
            >
              <p
                className="ts-text-left ts-font-bold ts-w-th1"
                style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}
              >
                {phrasesByKey.application_widgets_table_header_1}
              </p>
              <p
                className="ts-text-left ts-font-bold ts-w-th2"
                style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}
              >
                {phrasesByKey.application_widgets_table_header_2}
              </p>
              <p
                className="ts-text-left ts-font-bold ts-w-th3"
                style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}
              >
                {phrasesByKey.application_widgets_table_header_3}
              </p>
              <p
                className="ts-text-left ts-font-bold ts-w-th4"
                style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}
              >
                {phrasesByKey.application_widgets_table_header_4}
              </p>
              <div className="ts-w-th5" />
            </div>

            {/* Table rows */}
            {Array.isArray(widgetsChildren) && widgetsChildren.length === 0 && (
              <div className="ts-flex ts-items-center ts-pl-6 ts-py-4 ts-w-full ts-border-b ts-border-gray-100">
                <p id="no_widgets_text" className="ts-italic ts-w-full ts-text-sm" style={{ color: '#6b7280' }}>
                  {phrasesByKey.application_widgets_noWidgets}.
                </p>
              </div>
            )}

            {Array.isArray(widgetsChildren) &&
              widgetsChildren.length > 0 &&
              widgetsChildren
                .filter(
                  widget =>
                    allowsTrustedCheckoutWidget || widget.applicationType !== 'checkout_service',
                )
                .map(widget => (
                <WidgetRow
                  key={widget.widgetId}
                  widget={widget}
                  widgetsFromAPI={widgetsFromAPI}
                  phrasesByKey={phrasesByKey}
                  availableProducts={availableProducts}
                  widgetsWithoutProductId={widgetsWithoutProductId}
                />
              ))}

            {/* Create new widget + Save */}
            <div className="ts-flex ts-items-center ts-justify-between ts-px-6 ts-py-4">
              <button
                id="button_openPopupCreateWidget"
                data-testid="button_openPopupCreateWidget"
                type="button"
                disabled={!selectedShopChannels.eTrustedChannelRef}
                onClick={() => setOpenModal(true)}
                className="ts-flex ts-items-center ts-gap-1 ts-text-sm ts-font-normal ts-bg-transparent ts-border-0 ts-cursor-pointer disabled:ts-opacity-50 disabled:ts-cursor-not-allowed"
                style={{ color: '#155DFC' }}
              >
                {phrasesByKey.application_widgets_create}
              </button>

              <button
                id="button_saveWidgetsChanges"
                data-testid="button_saveWidgetsChanges"
                type="button"
                onClick={handleSaveChanges}
                disabled={!selectedShopChannels.eTrustedChannelRef || isButtonDisabled}
                className="ts-text-white ts-text-sm ts-font-bold ts-px-6 ts-py-2 ts-border-0 ts-cursor-pointer disabled:ts-opacity-50 disabled:ts-cursor-not-allowed"
                style={{
                  background: 'linear-gradient(180deg, #1c8dc6 0%, #005aa0 100%)',
                  borderRadius: '8px',
                  height: '36px',
                }}
              >
                {phrasesByKey.global_button_submit}
              </button>
            </div>
          </div>

          {/* Card 3: About Widgets */}
          <div
            className="ts-rounded-[16px] ts-p-8"
            style={{
              background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
              border: '1px solid #E5E7EB',
            }}
          >
            <div className="ts-flex ts-items-start ts-gap-4">
              <div className="ts-flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <circle cx="20" cy="20" r="19" fill="#EFF6FF" stroke="#DBEAFE" stroke-width="1" />
                  <circle cx="20" cy="20" r="8" stroke="#3B82F6" stroke-width="1.5" fill="none" />
                  <path d="M20 17V20.5" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" />
                  <circle cx="20" cy="23" r="0.75" fill="#3B82F6" />
                </svg>
              </div>
              <div>
                <p className="ts-text-default ts-text-sm ts-font-bold ts-mb-1">
                  About Widgets
                </p>
                <p className="ts-text-sm ts-font-normal ts-mb-3" style={{ color: '#6b7280' }}>
                  Widgets are created and managed in the eTrusted Control Centre. Once created, they automatically sync to your {infoOfSystem.nameOfSystem} installation and can be placed across your website.
                </p>
                <a
                  href={phrasesByKey.application_widgets_popup_submit_url_1}
                  className="ts-text-sm ts-font-normal ts-inline-flex ts-items-center ts-gap-1"
                  style={{ color: '#2563EB' }}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open eTrusted Control Centre
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M7.5 1.5H10.5V4.5" stroke="#2563EB" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5 7L10.5 1.5" stroke="#2563EB" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 6.5V9.5C9 9.76522 8.89464 10.0196 8.70711 10.2071C8.51957 10.3946 8.26522 10.5 8 10.5H2.5C2.23478 10.5 1.98043 10.3946 1.79289 10.2071C1.60536 10.0196 1.5 9.76522 1.5 9.5V4C1.5 3.73478 1.60536 3.48043 1.79289 3.29289C1.98043 3.10536 2.23478 3 2.5 3H5.5" stroke="#2563EB" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
      <CreateWidgetPopup
        phrasesByKey={phrasesByKey}
        channelRef={selectedShopChannels.eTrustedChannelRef}
        modalIsOpen={modalIsOpen}
        setOpenModal={setOpenModal}
      />
    </div>
  )
}

export default WidgetsTab
