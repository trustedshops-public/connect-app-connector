import { DEV } from '../baseLayerDev'

type StatusInviteAction = {
  activeStatus: {
    product?: { name: string; ID: string; event_type?: string }
    service: { name: string; ID: string; event_type?: string }
  }
}

export const getUsedOrderStaruses = (defaultEnv?: string): Nullable<StatusInviteAction> => {
  switch (process.env.productIdentifiers || defaultEnv) {
    case DEV: // value for 'development'
      return {
        activeStatus: {
          product: { name: 'Awaiting Payment', ID: '1' },
          service: { name: 'Processing in progress', ID: '3' },
        },
      }
    default:
      return null
  }
}
