import { TEST } from '../baseLayerDev'

export const getStructuredMarkupConfiguration = (
  defaultEnv?: string
): { structuredMarkupEnabled: boolean } => {
  switch (process.env.infoSystem || defaultEnv) {
    case TEST: //value for 'test'
      return {
        structuredMarkupEnabled: true,
      }
    default: // 'development' and everything else defaults to disabled
      return {
        structuredMarkupEnabled: false,
      }
  }
}
