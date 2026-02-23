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
  allowSupportTrstdLogin?: boolean
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
