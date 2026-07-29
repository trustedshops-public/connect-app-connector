export interface IUserInfo {
  nameOfSystem: string
  versionNumberOfSystem: string
  versionNumberOfPlugin?: string
  allowsEstimatedDeliveryDate?: boolean
  allowsEventsByOrderStatus?: boolean
  allowsSendReviewInvitesForPreviousOrders?: boolean
  allowsSendReviewInvitesForProduct?: boolean
  allowsEditIntegrationCode?: boolean
  allowsSupportWidgets?: boolean
  useVersionNumberOfConnector?: string
  allowsTrustedCheckoutWidget?: boolean
  allowsSupportTrstdLogin?: boolean
  allowsSupportStructuredMarkup?: boolean
  /** Placement customization (CSS selector + position) is configured in the connector instead of the shop's theme tooling. */
  allowsSupportTrstdLoginCustomization?: boolean
  /** Deep link that opens the shop's theme tooling with the app embed pre-activated (currently Shopify only). */
  appEmbedDeepLink?: string
  /** Detected activation state of the app embed on the published theme; undefined when unknown (currently Shopify only). */
  appEmbedActivated?: boolean
}

export interface InfoState {
  language: string
  infoOfSystem: IUserInfo
}

export interface InfoStore {
  infoState: InfoState
  setLanguage: (language: string) => void
  getInfoOfSystem: (info: IUserInfo) => void
}
