import { DEV } from '../baseLayerDev'

export const getOrderStaruses = (defaultEnv?: string): { [key: string]: string | number }[] => {
  switch (process.env.productIdentifiers || defaultEnv) {
    case DEV: // value for 'development'
      return [
        { name: 'Awaiting Payment', ID: '1' },
        { name: 'Payment accepted', ID: '2' },
        { name: 'Processing in progress', ID: '3' },
        { name: 'Shipped', ID: '4' },
        { name: 'Delivered', ID: '5' },
        { name: 'Canceled', ID: '6' },
        { name: 'Refunded', ID: '7' },
      ]
    default:
      return []
  }
}
