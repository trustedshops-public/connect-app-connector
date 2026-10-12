import { IAuthorizeResult } from '@/authentication/type'
import { ConnectFailure } from '@/authentication/connectFlow'

export interface IAuthRequest {
  clientId: string
  clientSecret: string
}

export type IAuthState = {
  user: Nullable<IAuthorizeResult>
  isAuthLoading: boolean
  isAuthFailed: boolean
  isAuthenticated: boolean
  isAuthError: boolean
  isRelogin: boolean
  // "Connect with Trusted Shops": waiting for the merchant in the Control Center
  isConnecting: boolean
  connectError: Nullable<ConnectFailure>
}

export interface IAuthStore {
  auth: IAuthState
  signIn: (request: IAuthRequest) => void
  connectWithControlCenter: () => void
  cancelConnectWithControlCenter: () => void
  setIsAuthLoading: (value: boolean) => void
  setUser: () => void
  refresh: (request: IAuthRequest) => void
  logout: () => void
  reLogin: () => void
}
