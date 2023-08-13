import { DEV, TEST } from '../baseLayerDev'

const DEVStatuses = [
    { name: 'Awaiting Payment', ID: 1 , event_type: 'Awaiting Payment' },
    { name: 'Payment accepted', ID: 2, event_type:'Payment accepted' },
    { name: 'Processing in progress', ID: 3, event_type:'Processing in progress' },
    { name: 'Shipped', ID: 4, event_type:'Shipped' },
    { name: 'Delivered', ID: 5, event_type:'Delivered' },
    { name: 'Canceled', ID: 6, event_type:'Canceled' },
    { name: 'Refunded', ID: 7, event_type:'Refunded' }
  ];

export const getOrderStatus = (defaultEnv?: string): { name: string; ID: number, event_type: string }[] | null => {
  
  switch (process.env.reviewChannel || defaultEnv) {
    case DEV:
      return DEVStatuses;

    case TEST:
      return DEVStatuses;

    default:
      return null;
  }
};
