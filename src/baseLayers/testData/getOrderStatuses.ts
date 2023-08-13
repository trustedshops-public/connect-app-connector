import { DEV } from '../baseLayerDev'

export const getOrderStaruses = (defaultEnv?: string): { [key: string]: string | number }[] => {
  switch (process.env.productIdentifiers || defaultEnv) {
    case DEV: // value for 'development'
      return [
        { name: 'Awaiting Payment', ID: '1' },
        { name: 'Payment accepted', ID: '2' },
        { name: 'Processing in progress', ID: '3', event_type: 'Processing in progress' },
        { name: 'Shipped', ID: '4', event_type: 'Shipped' },
        { name: 'Delivered', ID: '5', event_type: 'Delivered' },
        { name: 'Canceled', ID: '6', event_type: 'Canceled' },
        { name: 'Refunded', ID: '7', event_type: 'Refunded' },
      ]
    default:
      return []
  }
}
