import { DEV, TEST } from '../baseLayerDev'

export const getTrstdLoginLocation = (
  defaultEnv?: string,
): { id: string; name: string }[] => {
  switch (process.env.trstdLoginLocation || defaultEnv) {
    case DEV:
      return [
        { id: 'trstd-loc-navbar', name: 'Navigation bar' },
        { id: 'trstd-loc-cst', name: 'Custom' },
      ]
    case TEST:
      return [
        { id: 'trstd-loc-navbar', name: 'Navigation bar' },
        { id: 'trstd-loc-cst', name: 'Custom' },
      ]
    default:
      return []
  }
}
