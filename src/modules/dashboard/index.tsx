import { Fragment, h } from 'preact'
import { FC, Suspense, useEffect, useState } from 'preact/compat'
import Tabs, { ITabsConfig } from '@/components/layouts/tabs'
// Logo removed from dashboard header
import { DASHBOARD_KEYS } from '@/locales/types'
import { Option, Select } from '@/components/controls/dropdown'
import TextWithLink from '@/components/layouts/textWithLink'
import { dispatchAction, EVENTS } from '@/eventsLib'
import Spinner from '@/components/layouts/spinner'
import { getMappedChannels } from '@/store/channel/mapperForChannels'
import ToastList from '@/components/layouts/toast'
import withLocalisation from '@/locales/withLocalisation'
import { PHRASES_DASHBOARD_KEYS } from '@/locales/keys'
import useStore from '@/store/useStore'
import {
  selectorAuth,
  selectorChannels,
  selectorInfoOfSystem,
  selectorNotificationStore,
  selectorTrustbadgeState,
} from '@/store/selector'
import { AVAILABLE_VERSIONS } from './tabReviewInvites/v2/available-versions'
// BackgroundCard removed from dashboard
import ChannelSelectModal from './channelSelectModal'
import { LazyLoading } from '@/utils/lazyLoading'
import { TabProps } from '@/modules/type'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'

const DashboardPageModule: FC<{
  setPhrasesByKey: (keys: DASHBOARD_KEYS) => void
  phrasesByKey: DASHBOARD_KEYS
}> = ({ setPhrasesByKey, phrasesByKey }) => {
  const [openTab, setOpenTab] = useState<number>(0)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)

  const [tabConfig, setTabConfig] = useState<Nullable<ITabsConfig[]>>(null)

  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const { user } = useStore(selectorAuth)

  const {
    allowsEstimatedDeliveryDate,
    allowsEventsByOrderStatus,
    allowsSendReviewInvitesForPreviousOrders,
    allowsSendReviewInvitesForProduct,
    allowsSupportWidgets,
  } = infoOfSystem

  const displayReviewTab =
    allowsEstimatedDeliveryDate ||
    allowsEventsByOrderStatus ||
    allowsSendReviewInvitesForPreviousOrders ||
    allowsSendReviewInvitesForProduct

  const isVersionTwo =
    infoOfSystem.useVersionNumberOfConnector &&
    AVAILABLE_VERSIONS.includes(infoOfSystem.useVersionNumberOfConnector)
  const TrustBadgeTab = (props: TabProps) => (
    <LazyLoading props={props} importComponent={() => import('./tabTrustBadge/index')} />
  )

  const WidgetTab = (props: TabProps) => (
    <LazyLoading props={props} importComponent={() => import('./tabWidgets/index')} />
  )

  const ReviewInvitesTab_v2 = (props: TabProps) => (
    <LazyLoading
      props={props}
      importComponent={() => import('./tabReviewInvites/v2/ReviewInvitesTab_v2')}
    />
  )

  const ReviewInvitesTab = (props: TabProps) => (
    <LazyLoading props={props} importComponent={() => import('./tabReviewInvites/index')} />
  )

  const SettingsTab = (props: TabProps) => (
    <LazyLoading props={props} importComponent={() => import('./tabSettings/index')} />
  )

  const {
    isChannelsLoading,
    mappedChannels,
    selectedShopChannels,
    selectedeTrustedChannelRef,
    channelsFromTSC,
    shopChannels,
    showChannelModal,
  } = useStore(selectorChannels)
  const { errorNotification } = useStore(selectorTrustbadgeState)

  const {
    getTrustbadge,
    clearTrustbadgeData,
    setIsLoading,
    setETrustedChannelRef,
    getWidgetsFromAPI,
    clearWidgetData,
    setSelectedShopChennel,
    setIsChannelsLoading,
    setSelectedChannels,
    addInToastList,
    setIsLoadingInvitesForProducts,
    getEventTypesFromApi,
    getEventTypesFromApi_v2,
    setInitialOrderStatusByMapping,
  } = useStore()

  const { toastList } = useStore(selectorNotificationStore)

  useEffect(() => {
    setPhrasesByKey(PHRASES_DASHBOARD_KEYS)
    setIsChannelsLoading(true)
    dispatchAction({ action: EVENTS.GET_MAPPED_CHANNELS, payload: null })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedeTrustedChannelRef) {
        clearTrustbadgeData()
        clearWidgetData()
        return
      }
      getTrustbadge(selectedShopChannels)
      clearWidgetData()

      setIsLoading(true)
      setETrustedChannelRef({
        channelRef: selectedShopChannels.eTrustedChannelRef,
        accountRef: selectedShopChannels.eTrustedAccountRef,
      })
      getWidgetsFromAPI()
      displayReviewTab && setIsLoadingInvitesForProducts(true)

      if (
        Object.prototype.hasOwnProperty.call(infoOfSystem, 'allowsSupportWidgets') &&
        infoOfSystem.allowsSupportWidgets
      ) {
        dispatchAction({
          action: EVENTS.GET_WIDGET_PROVIDED,
          payload: {
            id: selectedShopChannels.eTrustedChannelRef,
            eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
            salesChannelRef: selectedShopChannels.salesChannelRef,
          },
        })
        dispatchAction({
          action: EVENTS.GET_LOCATION_FOR_WIDGET,
          payload: {
            id: selectedShopChannels.eTrustedChannelRef,
            eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
            salesChannelRef: selectedShopChannels.salesChannelRef,
          },
        })
        dispatchAction({
          action: EVENTS.GET_AVAILABLE_PRODUCT_IDENTIFIERS,
          payload: {
            id: selectedShopChannels.eTrustedChannelRef,
            eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
            salesChannelRef: selectedShopChannels.salesChannelRef,
          },
        })
      }

      if (displayReviewTab && !isVersionTwo) {
        // call EventTypes for v1
        if (
          Object.prototype.hasOwnProperty.call(infoOfSystem, 'allowsSendReviewInvitesForProduct') &&
          infoOfSystem.allowsSendReviewInvitesForProduct
        ) {
          dispatchAction({
            action: EVENTS.GET_PRODUCT_REVIEW_FOR_CHANNEL,
            payload: {
              id: selectedeTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        }
        if (
          Object.prototype.hasOwnProperty.call(infoOfSystem, 'allowsEstimatedDeliveryDate') &&
          infoOfSystem.allowsEstimatedDeliveryDate
        ) {
          dispatchAction({
            action: EVENTS.GET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL,
            payload: {
              id: selectedeTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels?.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        }

        if (
          Object.prototype.hasOwnProperty.call(infoOfSystem, 'allowsEventsByOrderStatus') &&
          infoOfSystem.allowsEventsByOrderStatus
        ) {
          dispatchAction({
            action: EVENTS.GET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL,
            payload: {
              id: selectedeTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        }

        if (infoOfSystem.allowsEstimatedDeliveryDate || infoOfSystem.allowsEventsByOrderStatus) {
          await getEventTypesFromApi()
        }
      }

      if (displayReviewTab && isVersionTwo) {
        // call EventTypes for v2
        if (Object.prototype.hasOwnProperty.call(infoOfSystem, 'allowsEventsByOrderStatus')) {
          dispatchAction({
            action: EVENTS.GET_AVAILABLE_ORDER_STATUSES,
            payload: {
              id: selectedShopChannels.eTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        }
        dispatchAction({
          action: EVENTS.GET_USED_ORDER_STATUSES,
          payload: {
            eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
            salesChannelRef: selectedShopChannels.salesChannelRef,
          },
        })
        if (infoOfSystem.allowsEstimatedDeliveryDate || infoOfSystem.allowsEventsByOrderStatus) {
          await getEventTypesFromApi_v2()
        }
      }
    }
    fetchData()
  }, [selectedShopChannels])

  useEffect(() => {
    if (mappedChannels.length) return

    if (!showChannelModal) {
      setIsChannelsLoading(false)
      return
    }

    if (shopChannels.length && channelsFromTSC.length) {
      const mappedChannelsResult = getMappedChannels(shopChannels, channelsFromTSC)

      if (mappedChannelsResult.length === shopChannels.length) {
        setSelectedChannels([...mappedChannelsResult])
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { auth, ...stateWithoutAuth } = useStore.getState()
        dispatchAction({
          action: EVENTS.SAVE_MAPPED_CHANNEL,
          payload: mappedChannelsResult,
        })
        displayReviewTab && setInitialOrderStatusByMapping(mappedChannelsResult)
        handleEtrustedConfiguration(
          user?.access_token,
          stateWithoutAuth,
          'channelSelector',
          putEtrustedConfiguration,
        )
      } else {
        setSelectedChannels(mappedChannelsResult)
        setIsChannelsLoading(false)
        setShowModal(true)
      }
    }
  }, [channelsFromTSC, shopChannels])

  useEffect(() => {
    if (!phrasesByKey) return

    const tabs: ITabsConfig[] = [
      {
        id: 0,
        name: phrasesByKey.application_routes_trustbadge,
        component: <TrustBadgeTab phrasesByKey={phrasesByKey} />,
      },
      {
        id: 1,
        name: phrasesByKey.application_routes_widgets,
        component: <WidgetTab phrasesByKey={phrasesByKey} />,
        isAvailable: allowsSupportWidgets,
      },
      {
        id: 2,
        name: phrasesByKey.application_routes_invites,
        component: isVersionTwo ? (
          <ReviewInvitesTab_v2 phrasesByKey={phrasesByKey} />
        ) : (
          <ReviewInvitesTab phrasesByKey={phrasesByKey} />
        ),
        isAvailable: displayReviewTab,
      },
    ]

    setTabConfig(tabs)
  }, [phrasesByKey, infoOfSystem])

  useEffect(() => {
    if (!errorNotification.errorText) return

    addInToastList({
      event: '',
      text: '',
      errorText: errorNotification.errorText,
      status: errorNotification.status,
    })
  }, [errorNotification])

  return (
    tabConfig && (
      <>
        <Suspense fallback={<Spinner />}>
          <div
            id={'dashboard_wrapper'}
            className="ts-flex ts-flex-col ts-font-sans ts-w-full"
          >
            {isChannelsLoading ? (
              <div className="ts-flex ts-flex-col ts-items-center ts-justify-center ts-h-96">
                <Spinner />
              </div>
            ) : (
              <>
                {/* Header bar - centered like tabs and content */}
                <div className="ts-w-full ts-pt-8 ts-pb-6">
                  <div className="ts-flex ts-items-center ts-justify-between ts-max-w-backgroundCard ts-mx-auto ts-px-8">
                    {!showSettings && (
                      <div className="ts-flex ts-items-center ts-gap-2">
                        <label
                          className={`${
                            !mappedChannels.length ? 'ts-text-secondary' : 'ts-text-darkLabel'
                          } ts-font-normal ts-text-sm`}
                        >
                          Channel
                        </label>
                        <Select
                          testId={'channelSelection'}
                          id={'channelSelection'}
                          placeholder="Choose an option"
                          defaultValue={
                            selectedShopChannels && selectedShopChannels?.salesChannelName
                          }
                          disabled={!mappedChannels.length}
                        >
                          {mappedChannels.map(item => (
                            <Option
                              testId={`channel_${item.eTrustedChannelRef}`}
                              id={`channel_${item.eTrustedChannelRef}`}
                              key={item.salesChannelRef}
                              value={item.salesChannelRef}
                              changeSelectedOption={setSelectedShopChennel}
                            >
                              <p className="ts-m-2 ts-text-default ts-font-normal ts-text-sm">
                                {item.salesChannelName}
                              </p>
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                    {showSettings && <div />}
                    <button
                      id="button_channelMapping"
                      data-testid="button_channelMapping"
                      type="button"
                      onClick={() => setShowSettings(true)}
                      className="ts-flex ts-items-center ts-gap-1 ts-cursor-pointer ts-bg-transparent ts-px-4 ts-py-2 ts-rounded-full"
                      style={{
                        color: '#024DF0',
                        border: showSettings ? '1.5px solid #024DF0' : '1.5px solid transparent',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M6.586 2.586A2 2 0 0 1 8 2a2 2 0 0 1 1.414.586A2 2 0 0 1 10 4c0 .39-.112.773-.327 1.1l.007.007.32.32.32-.32A2 2 0 0 1 12 4a2 2 0 0 1 2 2 2 2 0 0 1-.586 1.414A2 2 0 0 1 12 8c-.39 0-.773-.112-1.1-.327l-.007.007-.32.32.32.32A2 2 0 0 1 12 10a2 2 0 0 1-2 2 2 2 0 0 1-1.414-.586A2 2 0 0 1 8 10c0-.39.112-.773.327-1.1l-.007-.007-.32-.32-.32.32A2 2 0 0 1 6 10a2 2 0 0 1-2-2c0-.553.224-1.053.586-1.414A2 2 0 0 1 6 6c.39 0 .773.112 1.1.327l.007-.007.32-.32-.32-.32A2 2 0 0 1 6 4a2 2 0 0 1 .586-1.414z"
                          stroke="currentColor"
                          stroke-width="1.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          fill="none"
                        />
                        <circle cx="8" cy="8" r="1.5" stroke="currentColor" stroke-width="1.2" fill="none" />
                      </svg>
                      <span className="ts-text-sm ts-font-normal">
                        Channel mapping
                      </span>
                    </button>
                  </div>
                </div>

                {/* Tabs bar - full width border, tabs centered */}
                <div className="ts-w-full ts-border-b ts-border-gray-divider">
                  <div className="ts-max-w-backgroundCard ts-mx-auto ts-px-8">
                    <Tabs
                      tabs={tabConfig}
                      openTab={showSettings ? -1 : openTab}
                      setOpenTab={(id: number) => {
                        setShowSettings(false)
                        setOpenTab(id)
                      }}
                      renderContent={false}
                    />
                  </div>
                </div>

                {/* Content area - centered */}
                <div className="ts-max-w-backgroundCard ts-mx-auto ts-w-full ts-px-8 ts-py-6">
                  {showSettings ? (
                    <SettingsTab phrasesByKey={phrasesByKey} />
                  ) : (
                    <div className="ts-w-full">
                      {tabConfig.find(item => item.id === openTab)?.component}
                    </div>
                  )}

                  {!!toastList.length && <ToastList phrasesByKey={phrasesByKey} />}

                  <div className="ts-flex ts-items-center ts-justify-center ts-mt-8">
                    {phrasesByKey && (
                      <TextWithLink
                        id={'jointcontrollership'}
                        text={phrasesByKey.global_jointcontrollership_text}
                        url={phrasesByKey.global_jointcontrollership_url_1}
                        textStyle="ts-text-secondary ts-font-normal ts-text-xxs ts-text-center"
                      />
                    )}
                  </div>
                  <div className="ts-flex ts-items-center ts-justify-center ts-mt-4">
                    {phrasesByKey && (
                      <TextWithLink
                        id={'copyright'}
                        text={phrasesByKey.global_copyright_text}
                        url={phrasesByKey.global_copyright_url_1}
                        textStyle="ts-text-secondary ts-font-normal ts-text-xxs ts-text-center"
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <ChannelSelectModal
            phrasesByKey={phrasesByKey}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </Suspense>
      </>
    )
  )
}

export default {
  routeProps: {
    path: '/ts/dashboard',
    component: withLocalisation(DashboardPageModule),
  },
  name: 'DashboardPageModule',
}
