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

export interface ITrstdLogin {
  id: string
  salesChannelRef: string
  configuration?: ITrstdLoginConfiguration
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
  updateTrstdLoginLocation: (location: ITrstdLoginLocation) => void
  clearTrstdLoginState: () => void
  getTrstdLoginConfiguration: (channel: IMappedChannel) => void
}
