import { Fragment, h } from 'preact'
import { FC, Suspense, useEffect, useState } from 'preact/compat'
import { useRef } from 'preact/hooks'
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
  selectorBookedFeatures,
  selectorChannels,
  selectorInfoOfSystem,
  selectorNotificationStore,
  selectorTrustbadgeState,
} from '@/store/selector'
import { AVAILABLE_VERSIONS } from './tabReviewInvites/v2/available-versions'
// BackgroundCard removed from dashboard 
import ChannelSelectModal from './channelSelectModal'
import TrustSignalsActivationModal from './trustSignalsActivationModal'
import { LazyLoading } from '@/utils/lazyLoading'
import { TabProps } from '@/modules/type'
import { putEtrustedConfiguration } from '@/api/api'
import { handleEtrustedConfiguration } from '@/utils/configurationDataHandler'
import OverviewTab from './tabOverview/index'
import { GearIcon } from '@/components/layouts/icons/GearIcon'
import { AppEmbedActivationBanner, AppEmbedActiveBanner } from './appEmbedBanner'
import { useFeatureAvailability } from '@/store/bookedFeatures/useFeatureAvailability'
import { getFeatureAvailability } from '@/store/bookedFeatures/featureAvailability'
import { BookedFeature } from '@/store/bookedFeatures/types'

const DashboardPageModule: FC<{
  setPhrasesByKey: (keys: DASHBOARD_KEYS) => void
  phrasesByKey: DASHBOARD_KEYS
}> = ({ setPhrasesByKey, phrasesByKey }) => {
  const [openTab, setOpenTab] = useState<number>(0)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [showTrustbadgeActivation, setShowTrustbadgeActivation] = useState(false)
  const [isPostMappingLoading, setIsPostMappingLoading] = useState(false)
  const isFirstTimeSelectionRef = useRef(false)
  const prevShowModalRef = useRef(false)
  const pendingActivationModalRef = useRef(false)

  const [tabConfig, setTabConfig] = useState<Nullable<ITabsConfig[]>>(null)

  const { infoOfSystem } = useStore(selectorInfoOfSystem)
  const { user } = useStore(selectorAuth)

  // Shopify only: the app embed must be activated once in the theme editor before
  // #trstd login / structured data can render. Shown on every tab; the deep link opens
  // the App embeds panel without touching the toggle, so the merchant turns it on and
  // saves it themselves.
  // Detection-based: the action-required banner is replaced by an informational one once
  // the base layer reports the embed as activated on the published theme
  // (appEmbedActivated === true). When the status is unknown (undefined), the
  // action-required banner stays visible — better one banner too many than a merchant
  // with an invisible integration.
  // Shop-level, with no feature condition: the embed is always listed in the theme
  // editor, so the prompt is always actionable and does not depend on which channel the
  // merchant happens to have selected.
  const isAppEmbedRelevant = infoOfSystem.nameOfSystem?.toLowerCase() === 'shopify'
  const showAppEmbedBanner =
    isAppEmbedRelevant && !!infoOfSystem.appEmbedDeepLink && infoOfSystem.appEmbedActivated !== true
  // Once the embed is confirmed active the banner flips to a reminder to keep it
  // turned on for every market the shop publishes.
  const showAppEmbedActiveBanner = isAppEmbedRelevant && infoOfSystem.appEmbedActivated === true

  const {
    allowsEstimatedDeliveryDate,
    allowsEventsByOrderStatus,
    allowsSendReviewInvitesForPreviousOrders,
    allowsSendReviewInvitesForProduct,
    allowsSupportWidgets,
    allowsSupportTrstdLogin,
  } = infoOfSystem

  // Shop system level - the tabs without booked features and the defaults saved while mapping
  const displayReviewTab =
    allowsEstimatedDeliveryDate ||
    allowsEventsByOrderStatus ||
    allowsSendReviewInvitesForPreviousOrders ||
    allowsSendReviewInvitesForProduct

  const isVersionTwo =
    infoOfSystem.useVersionNumberOfConnector &&
    AVAILABLE_VERSIONS.includes(infoOfSystem.useVersionNumberOfConnector)

  // Selected channel level: supported by the shop system and booked for the channel
  const features = useFeatureAvailability()
  const { isBookedFeaturesLoading } = useStore(selectorBookedFeatures)

  const TrstdLoginTab = (props: TabProps) => (
    <LazyLoading props={props} importComponent={() => import('./tabTrstdLogin/index')} />
  )

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
    getTrstdLoginConfiguration,
    clearTrstdLoginState,
    getStructuredMarkupConfiguration,
    clearStructuredMarkupState,
    getBookedFeatures,
  } = useStore()

  const { toastList } = useStore(selectorNotificationStore)

  useEffect(() => {
    setPhrasesByKey(PHRASES_DASHBOARD_KEYS)
    setIsChannelsLoading(true)
    getBookedFeatures()
    dispatchAction({ action: EVENTS.GET_MAPPED_CHANNELS, payload: null })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedeTrustedChannelRef) {
        clearTrustbadgeData()
        clearWidgetData()
        return
      }
      // Runs again once the booked features of the channel are known
      if (isBookedFeaturesLoading) return

      getTrustbadge(selectedShopChannels)
      clearWidgetData()
      clearTrstdLoginState()
      clearStructuredMarkupState()

      if (features.trstdLogin) {
        getTrstdLoginConfiguration(selectedShopChannels)
      }

      if (features.aiVisibility) {
        getStructuredMarkupConfiguration(selectedShopChannels)
      }

      setIsLoading(true)
      setETrustedChannelRef({
        channelRef: selectedShopChannels.eTrustedChannelRef,
        accountRef: selectedShopChannels.eTrustedAccountRef,
      })
      features.isBooked(BookedFeature.REVIEW_WIDGETS) && getWidgetsFromAPI()
      features.reviewInvites && setIsLoadingInvitesForProducts(true)

      if (features.widgets) {
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

      if (features.reviewInvites && !isVersionTwo) {
        // call EventTypes for v1 
        if (features.productReviews) {
          dispatchAction({
            action: EVENTS.GET_PRODUCT_REVIEW_FOR_CHANNEL,
            payload: {
              id: selectedeTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        }
        if (features.orderStatusInvites && infoOfSystem.allowsEstimatedDeliveryDate) {
          dispatchAction({
            action: EVENTS.GET_USE_ESTIMATED_DELIVERY_DATE_FOR_CHANNEL,
            payload: {
              id: selectedeTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels?.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        }

        if (features.orderStatusInvites && infoOfSystem.allowsEventsByOrderStatus) {
          dispatchAction({
            action: EVENTS.GET_USE_EVENTS_BY_ORDER_STATUS_FOR_CHANNEL,
            payload: {
              id: selectedeTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        }

        if (features.orderStatusInvites) {
          await getEventTypesFromApi()
        }
      }

      if (features.reviewInvites && isVersionTwo) {
        const isOrderStatusBooked = features.isBooked(
          BookedFeature.SEND_REVIEW_INVITES_BASED_ON_ORDER_STATUS,
        )
        // call EventTypes for v2
        if (
          Object.prototype.hasOwnProperty.call(infoOfSystem, 'allowsEventsByOrderStatus') &&
          isOrderStatusBooked
        ) {
          dispatchAction({
            action: EVENTS.GET_AVAILABLE_ORDER_STATUSES,
            payload: {
              id: selectedShopChannels.eTrustedChannelRef,
              eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        }
        isOrderStatusBooked &&
          dispatchAction({
            action: EVENTS.GET_USED_ORDER_STATUSES,
            payload: {
              eTrustedChannelRef: selectedShopChannels.eTrustedChannelRef,
              salesChannelRef: selectedShopChannels.salesChannelRef,
            },
          })
        if (features.orderStatusInvites) {
          await getEventTypesFromApi_v2()
        }
      }

      if (pendingActivationModalRef.current) {
        pendingActivationModalRef.current = false
        setIsPostMappingLoading(false)
        // The modal goes live with the Trustbadge, so it is left out when no mapped channel has it
        const store = useStore.getState()
        const canActivateTrustbadge =
          !features.isBookingActive ||
          store.channelState.mappedChannels.some(
            channel => getFeatureAvailability(store, channel.eTrustedChannelRef).trustbadge,
          )
        canActivateTrustbadge && setShowTrustbadgeActivation(true)
      }
    }
    fetchData()
  }, [selectedShopChannels, isBookedFeaturesLoading])

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
        isFirstTimeSelectionRef.current = true
      }
    }
  }, [channelsFromTSC, shopChannels])

  useEffect(() => {
    if (prevShowModalRef.current && !showModal && isFirstTimeSelectionRef.current) {
      isFirstTimeSelectionRef.current = false
      pendingActivationModalRef.current = true
      setIsPostMappingLoading(true)
    }
    prevShowModalRef.current = showModal
  }, [showModal])

  const handleNavigateToTab = (tabId: number) => {
    setShowSettings(false)
    setOpenTab(tabId)
  }

  useEffect(() => {
    if (!phrasesByKey) return

    const tabs: ITabsConfig[] = [
      {
        id: 0,
        name: phrasesByKey.application_routes_overview,
        component: (
          <OverviewTab phrasesByKey={phrasesByKey} onNavigateToTab={handleNavigateToTab} />
        ),
      },
      {
        id: 1,
        name: phrasesByKey.application_routes_trstd_login,
        component: <TrstdLoginTab phrasesByKey={phrasesByKey} />,
        isAvailable: features.isBookingActive ? features.trstdLogin : allowsSupportTrstdLogin,
      },
      {
        id: 2,
        name: phrasesByKey.application_routes_trustbadge,
        component: <TrustBadgeTab phrasesByKey={phrasesByKey} />,
        isAvailable: features.isBookingActive ? features.trustbadge : undefined,
      },
      {
        id: 3,
        name: phrasesByKey.application_routes_widgets,
        component: <WidgetTab phrasesByKey={phrasesByKey} />,
        isAvailable: features.isBookingActive ? features.widgets : allowsSupportWidgets,
      },
      {
        id: 4,
        name: phrasesByKey.application_routes_invites,
        component: isVersionTwo ? (
          <ReviewInvitesTab_v2 phrasesByKey={phrasesByKey} />
        ) : (
          <ReviewInvitesTab phrasesByKey={phrasesByKey} />
        ),
        isAvailable: features.isBookingActive ? features.reviewInvites : displayReviewTab,
      },
    ]

    setTabConfig(tabs)
  }, [phrasesByKey, infoOfSystem, features])

  const isOpenTabHidden =
    features.isBookingActive && tabConfig?.find(item => item.id === openTab)?.isAvailable === false

  // A channel without the booked feature of the open tab falls back to the overview
  useEffect(() => {
    if (isOpenTabHidden) setOpenTab(0)
  }, [isOpenTabHidden])

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
            style={{ backgroundColor: '#F9FAFB' }}
          >
            {isChannelsLoading || isBookedFeaturesLoading ? (
              <div className="ts-flex ts-flex-col ts-items-center ts-justify-center ts-h-96">
                <Spinner />
              </div>
            ) : (
              <>
                {/* Header bar - centered like tabs and content */}
                <div className="ts-w-full ts-pt-6 sm:ts-pt-8 ts-pb-4 sm:ts-pb-6" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="ts-flex ts-flex-wrap ts-items-center ts-justify-between ts-gap-3 ts-max-w-backgroundCard ts-mx-auto ts-px-4 sm:ts-px-8">
                    {!showSettings && (
                      <div className="ts-flex ts-items-center ts-gap-2 ts-min-w-0">
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
                      className="ts-flex ts-items-center ts-gap-1 ts-cursor-pointer ts-bg-transparent ts-px-4 ts-py-2 ts-rounded-[8px]"
                      style={{
                        color: '#024DF0',
                        border: showSettings ? '2px solid #024DF0' : '2px solid transparent',
                      }}
                    >
                      <GearIcon />
                      <span className="ts-text-sm ts-font-normal">
                        {phrasesByKey.application_routes_settings}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Tabs bar - full width border, tabs centered */}
                <div className="ts-w-full ts-border-b ts-border-gray-divider" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="ts-max-w-backgroundCard ts-mx-auto ts-px-4 sm:ts-px-8">
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

                {/* App embed banners (Shopify only) - visible on all tabs */}
                {showAppEmbedBanner && (
                  <AppEmbedActivationBanner
                    phrasesByKey={phrasesByKey}
                    deepLink={infoOfSystem.appEmbedDeepLink as string}
                  />
                )}
                {showAppEmbedActiveBanner && <AppEmbedActiveBanner phrasesByKey={phrasesByKey} />}

                {/* Content area - centered */}
                <div className="ts-max-w-backgroundCard ts-mx-auto ts-w-full ts-px-4 sm:ts-px-8 ts-py-6" style={{ backgroundColor: '#F9FAFB', minHeight: '100%', flex: 1 }}>
                  {showSettings ? (
                    <SettingsTab phrasesByKey={phrasesByKey} />
                  ) : (
                    <div className="ts-w-full">
                      {!isOpenTabHidden && tabConfig.find(item => item.id === openTab)?.component}
                    </div>
                  )}

                  {!!toastList.length && <ToastList phrasesByKey={phrasesByKey} />}
                </div>

                {/* Footer - always rendered outside content area */}
                <div className="ts-max-w-backgroundCard ts-mx-auto ts-w-full ts-px-4 sm:ts-px-8 ts-pb-6" style={{ backgroundColor: '#F9FAFB' }}>
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
          {isPostMappingLoading && (
            <Fragment>
              <div className="ts-justify-center ts-items-center ts-flex ts-fixed ts-inset-0 ts-z-50">
                <Spinner />
              </div>
              <div className="ts-fixed ts-inset-0 ts-z-40 ts-bg-white/70 ts-backdrop-blur-3xl" />
            </Fragment>
          )}
          <TrustSignalsActivationModal
            phrasesByKey={phrasesByKey}
            showModal={showTrustbadgeActivation}
            onClose={() => setShowTrustbadgeActivation(false)}
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
