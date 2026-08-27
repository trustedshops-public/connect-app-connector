import { DEV, TEST } from '../baseLayerDev'

export const getInformationOfSystem = (
  defaultEnv?: string
): { [key: string]: string | boolean } => {
  switch (process.env.infoSystem || defaultEnv) {
    case DEV: // value for 'development'
      return {
        nameOfSystem: 'shopware5',
        versionNumberOfSystem: 'mockBLDev-0.0.1',
        versionNumberOfPlugin: 'mockBLPlugin-0.0.1',
        allowsEstimatedDeliveryDate: false,
        allowsEventsByOrderStatus: true,
        allowsSendReviewInvitesForPreviousOrders: true,
        allowsSendReviewInvitesForProduct: true,
        allowsEditIntegrationCode: true,
        allowsSupportWidgets: true,
        useVersionNumberOfConnector: '2.0',
        allowsSupportStructuredMarkup: true,
      }
    case TEST: //value for 'test'
      return {
        nameOfSystem: 'shopify',
        versionNumberOfSystem: 'mockBLSystemTest-0.0.1',
        versionNumberOfPlugin: 'mockBLPlugin-0.0.1',
        allowsEstimatedDeliveryDate: true,
        allowsEventsByOrderStatus: true,
        allowsSendReviewInvitesForPreviousOrders: true,
        useVersionNumberOfConnector: '2.0',
        allowsSupportTrstdLogin: true,
        allowsSupportStructuredMarkup: true,
        allowsSupportTrstdLoginCustomization: true,
        appEmbedDeepLink:
          'https://admin.shopify.com/store/easyintegration5/themes/current/editor?context=apps&activateAppId=76225a13856974212ff3217b5b6ecb4d/trstd-login',
        // Mock: embed not yet activated, so the activation banner is visible in dev:test.
        appEmbedActivated: false,
      }
    case 'no_value':
      return {}

    default:
      return {}
  }
}
