/** Features the middleware `GET /booked-features` endpoint can report for a channel. */
export enum BookedFeature {
  TRSTD_LOGIN = 'FEAT_TRSTD_LOGIN',
  TRUSTBADGE = 'FEAT_TRUSTBADGE',
  REVIEW_WIDGETS = 'FEAT_REVIEW_WIDGETS_GROUP_SERVICE',
  COLLECT_PRODUCT_REVIEWS = 'FEAT_COLLECT_PRODUCT_REVIEWS',
  SEND_REVIEW_INVITES_BASED_ON_ORDER_STATUS = 'FEAT_PLUGIN_SEND_REVIEW_INVITES_BASED_ON_ORDER_STATUS',
  TRUSTBADGE_AI_VISIBILITY = 'FEAT_PLUGIN_TRUSTBADGE_AI_VISIBILITY',
  EXPORT_ORDERS = 'FEAT_EXPORT_ORDERS',
}

/**
 * One entry of the `GET /booked-features` response. The middleware already merges the
 * account features (valid for every channel) with the features of the channel itself,
 * so each feature key appears once. The values are empty objects for now.
 */
export interface IBookedFeaturesResponseItem {
  channel: string
  bookedFeatures: Array<Record<string, unknown>>
}

/** Booked feature keys per eTrusted channel ref. */
export type BookedFeaturesByChannel = Record<string, string[]>

export interface IBookedFeaturesState {
  /**
   * `null` while feature gating is inactive - it is switched off, or the request failed -
   * and every feature then counts as booked. Once loaded, a channel missing from the map
   * has no booked features.
   */
  bookedFeaturesByChannel: Nullable<BookedFeaturesByChannel>
  isBookedFeaturesLoading: boolean
}

export interface IBookedFeaturesStore {
  bookedFeaturesState: IBookedFeaturesState
  getBookedFeatures: () => Promise<void>
  clearBookedFeaturesState: () => void
}

/**
 * What the dashboard shows for one channel: the shop system has to support a feature
 * (infoOfSystem) and the channel has to have it booked.
 */
export interface IFeatureAvailability {
  /** False while feature gating is inactive - then only the shop system decides. */
  isBookingActive: boolean
  isBooked: (feature: BookedFeature) => boolean
  trstdLogin: boolean
  trustbadge: boolean
  /** Structured markup section inside the Trustbadge tab. */
  aiVisibility: boolean
  widgets: boolean
  /** Product review invites - a section in v1, the product select of the order status section in v2. */
  productReviews: boolean
  /** "Send review invites at the right time" section (order status / estimated delivery date). */
  orderStatusInvites: boolean
  /** Review invites for previous orders (export). */
  exportOrders: boolean
  reviewInvites: boolean
}
