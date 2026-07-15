import { DEV, TEST } from '../baseLayerDev'

export const getStructuredMarkupConfiguration = (
  defaultEnv?: string
): { structuredMarkupEnabled: boolean } => {
  switch (process.env.infoSystem || defaultEnv) {
    case DEV: // value for 'development'
      return {
        structuredMarkupEnabled: false,
      }
    case TEST: //value for 'test'
      return {
        structuredMarkupEnabled: true,
      }
    default:
      return {
        structuredMarkupEnabled: false,
      }
  }
}
