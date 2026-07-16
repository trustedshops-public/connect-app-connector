import { TEST } from '../baseLayerDev'

export const getStructuredMarkupConfiguration = (
  defaultEnv?: string
): { structuredMarkupEnabled: boolean } => {
  const env = process.env.infoSystem || defaultEnv

  // enabled in 'test', disabled in 'development' and everything else
  return {
    structuredMarkupEnabled: env === TEST,
  }
}
