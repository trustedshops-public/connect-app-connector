import { IMappedChannel } from '../channel/types'

export interface ITrstdLoginConfiguration {
  script?: {
    tag?: string
    attributes?: {
      [key: string]: { value?: string; attributeName?: string }
    }
  }
  integration?: {
    applicationType: string
    tag?: string
    location?: {
      id: string
      name: string
    }
    trstdLoginEnabled?: boolean
  }
}

/**
 * Shop-global placement overrides for the trstd-login element. Only supported when the
 * base layer reports `allowsSupportTrstdLoginCustomization` (currently Shopify). Keys
 * mirror the shop system's placement setting ids.
 */
export interface ITrstdLoginCustomization {
  target_selector?: string
  position_desktop?: string
  target_selector_mobile?: string
  position_mobile?: string
}

export interface ITrstdLogin {
  id: string
  salesChannelRef: string
  configuration?: ITrstdLoginConfiguration
  customization?: ITrstdLoginCustomization
}

export interface ITrstdLoginLocation {
  id: string
  name: string
}

export interface ITrstdLoginState {
  isLoadingBL: boolean
  trstdLoginData: ITrstdLogin
  initialTrstdLoginData: ITrstdLogin
  locations: ITrstdLoginLocation[]
}

export interface ITrstdLoginStore {
  trstdLoginState: ITrstdLoginState
  setTrstdLoginLoadingBL: (value: boolean) => void
  getTrstdLoginData: (data: ITrstdLogin) => void
  setTrstdLoginLocations: (locations: ITrstdLoginLocation[]) => void
  updateTrstdLoginEnabled: (enabled: boolean) => Promise<void>
  saveTrstdLoginCustomization: (customization: ITrstdLoginCustomization) => void
  updateTrstdLoginLocation: (location: ITrstdLoginLocation) => void
  clearTrstdLoginState: () => void
  getTrstdLoginConfiguration: (channel: IMappedChannel) => void
}
