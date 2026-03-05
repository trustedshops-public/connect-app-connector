import { ITrstdLogin } from './types'

const scriptSrc =
  process.env.VITE_NODE_ENV === 'development'
    ? 'https://widgets-qa.trustedshops.com/integration/integration.js'
    : 'https://widgets.trustedshops.com/integration/integration.js'


export const getTrstdLoginDefault = (
  salesChannelRef: string,
): ITrstdLogin => ({
  id: '',
  salesChannelRef,
  configuration: 
    {
      script: {
        tag: 'script',
        attributes: {
          type: { value: 'module', attributeName: 'type' },
          src: { value: scriptSrc, attributeName: 'src' },
          'data-integration-id': { value: '', attributeName: 'data-integration-id' },
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
})
