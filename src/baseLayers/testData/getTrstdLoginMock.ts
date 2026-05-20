import { ITrstdLogin } from '../types'
import { DEV, TEST } from '../baseLayerDev'

export const getTrstdLoginConfiguration = (
  defaultEnv?: string | number,
): ITrstdLogin | null => {
  switch (process.env.trstdLogin || defaultEnv) {
    case DEV:
      return {
        id: '',
        salesChannelRef: 'shop-7e52920a-2722-4881-9908-ecec98c716e4',
        configuration: {
          script: {
            tag: 'script',
            attributes: {
              type: { value: 'module', attributeName: 'type' },
              src: {
                value: 'https://widgets.trustedshops.com/integration/integration.js',
                attributeName: 'src',
              },
              'data-integration-id': {
                value: '',
                attributeName: 'data-integration-id',
              },
            },
          },
          integration: {
            applicationType: 'trstd_login',
            tag: 'trstd-login',
            location: {
              id: '',
              name: '',
            },
            trstdLoginEnabled: false,
          },
        },
      }
    case TEST:
      return {
        id: '',
        salesChannelRef: 'shop-7e52920a-2722-4881-9908-ecec98c716e4',
        configuration: {
          script: {
            tag: 'script',
            attributes: {
              type: { value: 'module', attributeName: 'type' },
              src: {
                value: 'https://widgets.trustedshops.com/integration/integration.js',
                attributeName: 'src',
              },
              'data-integration-id': {
                value: '',
                attributeName: 'data-integration-id',
              },
            },
          },
          integration: {
            applicationType: 'trstd_login',
            tag: 'trstd-login',
            location: {
              id: '',
              name: '',
            },
            trstdLoginEnabled: false,
          },
        },
      }
    case 'no_trstdlogin_config':
      return { id: '', salesChannelRef: '', configuration: {} }
    default:
      return null
  }
}
