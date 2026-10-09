import { IUserInfo } from '@/store/info/types'
import type { AppStore } from '../useStore'
import { BookedFeature, BookedFeaturesByChannel, IFeatureAvailability } from './types'

export const getBookedFeaturesOfChannel = (
  bookedFeaturesByChannel: Nullable<BookedFeaturesByChannel>,
  channelRef: string,
): Nullable<string[]> =>
  bookedFeaturesByChannel ? bookedFeaturesByChannel[channelRef] || [] : null

/**
 * Combines what the shop system supports with what the channel has booked.
 * `bookedFeatures === null` means feature gating is inactive and only the shop
 * system decides, as before the booked features existed.
 */
export const resolveFeatureAvailability = (
  infoOfSystem: IUserInfo,
  bookedFeatures: Nullable<string[]>,
): IFeatureAvailability => {
  const isBooked = (feature: BookedFeature) =>
    bookedFeatures === null || bookedFeatures.includes(feature)

  const trustbadge = isBooked(BookedFeature.TRUSTBADGE)
  const productReviews =
    !!infoOfSystem.allowsSendReviewInvitesForProduct &&
    isBooked(BookedFeature.COLLECT_PRODUCT_REVIEWS)
  const orderStatusInvites =
    !!(infoOfSystem.allowsEstimatedDeliveryDate || infoOfSystem.allowsEventsByOrderStatus) &&
    isBooked(BookedFeature.SEND_REVIEW_INVITES_BASED_ON_ORDER_STATUS)
  const exportOrders =
    !!infoOfSystem.allowsSendReviewInvitesForPreviousOrders && isBooked(BookedFeature.EXPORT_ORDERS)

  // Every flag is the condition of the shop system extended by the booking, so without
  // booked features each one is exactly the condition it was before
  return {
    isBookingActive: bookedFeatures !== null,
    isBooked,
    trstdLogin: !!infoOfSystem.allowsSupportTrstdLogin && isBooked(BookedFeature.TRSTD_LOGIN),
    trustbadge,
    // Lives inside the Trustbadge tab and can only be live together with the Trustbadge
    aiVisibility:
      trustbadge &&
      !!infoOfSystem.allowsSupportStructuredMarkup &&
      isBooked(BookedFeature.TRUSTBADGE_AI_VISIBILITY),
    widgets: !!infoOfSystem.allowsSupportWidgets && isBooked(BookedFeature.REVIEW_WIDGETS),
    productReviews,
    orderStatusInvites,
    exportOrders,
    reviewInvites: orderStatusInvites || exportOrders,
  }
}

/** Feature availability of a channel, for store actions and loops over several channels. */
export const getFeatureAvailability = (
  store: AppStore,
  channelRef: string = store.channelState.selectedeTrustedChannelRef,
): IFeatureAvailability =>
  resolveFeatureAvailability(
    store.infoState.infoOfSystem,
    getBookedFeaturesOfChannel(store.bookedFeaturesState.bookedFeaturesByChannel, channelRef),
  )
