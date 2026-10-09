import { AxiosError, AxiosResponse } from 'axios'
import { BookedFeature, IBookedFeaturesResponseItem } from '@/store/bookedFeatures/types'

/**
 * Mock of the middleware `GET /booked-features` endpoint, selected with the
 * `bookedFeatures` environment variable (see README.md). The scenarios work with any
 * mapped channels: features are given out by the position of the channel in the request.
 */

const ALL_FEATURES = Object.values(BookedFeature)

const ENABLEMENT_FEATURES = [
  BookedFeature.TRSTD_LOGIN,
  BookedFeature.TRUSTBADGE,
  BookedFeature.REVIEW_WIDGETS,
  BookedFeature.COLLECT_PRODUCT_REVIEWS,
]

interface IScenario {
  /** Booked for the whole account, so valid for every channel. */
  accountFeatures: string[]
  /** Booked for the channel at the given position of the request only. */
  channelFeatures?: (index: number) => string[]
  /** Channels at these positions are left out of the response. */
  missingChannels?: number[]
  delayInMs?: number
  errorStatus?: number
}

const SCENARIOS: Record<string, IScenario> = {
  // Every feature booked on account level
  allFeatures: { accountFeatures: ALL_FEATURES },
  // Nothing booked - only the Overview tab is left
  noFeatures: { accountFeatures: [] },
  onlyTrustbadge: { accountFeatures: [BookedFeature.TRUSTBADGE] },
  trustbadgeAndTrstdLogin: {
    accountFeatures: [BookedFeature.TRUSTBADGE, BookedFeature.TRSTD_LOGIN],
  },
  // Product features only: no AI visibility, order status invites or export
  withoutPluginFeatures: { accountFeatures: ENABLEMENT_FEATURES },
  // Review invites tab with the export only
  onlyExportOrders: { accountFeatures: [BookedFeature.TRUSTBADGE, BookedFeature.EXPORT_ORDERS] },
  // Order status invites without product reviews: the product select is hidden
  orderStatusWithoutProductReviews: {
    accountFeatures: [
      BookedFeature.TRUSTBADGE,
      BookedFeature.SEND_REVIEW_INVITES_BASED_ON_ORDER_STATUS,
    ],
  },
  // Trustbadge on account level, the rest differs per channel:
  // 1st channel everything, 2nd channel widgets only, every other channel nothing more
  mixedChannels: {
    accountFeatures: [BookedFeature.TRUSTBADGE],
    channelFeatures: index => {
      if (index === 0) return ALL_FEATURES
      if (index === 1) return [BookedFeature.REVIEW_WIDGETS]
      return []
    },
  },
  // 2nd channel is missing from the response and gets no features
  channelMissing: { accountFeatures: ALL_FEATURES, missingChannels: [1] },
  // Feature keys the connector does not know yet are ignored
  unknownFeature: { accountFeatures: [BookedFeature.TRUSTBADGE, 'FEAT_SOMETHING_NEW'] },
  // Long response time, to check the loading state
  slow: { accountFeatures: ALL_FEATURES, delayInMs: 3000 },
  // Errors - the connector falls back to the features of the shop system
  error400: { accountFeatures: [], errorStatus: 400 },
  error401: { accountFeatures: [], errorStatus: 401 },
  error500: { accountFeatures: [], errorStatus: 500 },
}

const ERROR_BODIES: Record<number, object> = {
  400: { message: 'Validation failed', errors: ['channels: Expected a list of channel ids'] },
  401: { message: 'Unauthorized' },
  500: { message: 'Internal Server Error' },
}

const toFeatureObject = (features: string[]): Record<string, unknown> =>
  features.reduce((result, feature) => ({ ...result, [feature]: {} }), {})

export const isBookedFeaturesMockScenario = (scenario: string): boolean =>
  Object.prototype.hasOwnProperty.call(SCENARIOS, scenario)

export const getBookedFeaturesMock = async (
  scenario: string,
  channelRefs: string[],
): Promise<IBookedFeaturesResponseItem[]> => {
  const {
    accountFeatures,
    channelFeatures = () => [],
    missingChannels = [],
    delayInMs = 300,
    errorStatus,
  } = SCENARIOS[scenario]

  await new Promise(resolve => setTimeout(resolve, delayInMs))

  if (errorStatus) {
    throw new AxiosError(
      `Request failed with status code ${errorStatus}`,
      AxiosError.ERR_BAD_RESPONSE,
      undefined,
      undefined,
      { status: errorStatus, data: ERROR_BODIES[errorStatus] } as AxiosResponse,
    )
  }

  return channelRefs
    .map((channel, index) => ({ channel, index }))
    .filter(({ index }) => !missingChannels.includes(index))
    .map(({ channel, index }) => ({
      channel,
      // Same merge as the middleware: object keys make every feature appear once
      bookedFeatures: [
        { ...toFeatureObject(accountFeatures), ...toFeatureObject(channelFeatures(index)) },
      ],
    }))
}
