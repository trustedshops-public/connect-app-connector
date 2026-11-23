import { IAuthorizeResult } from '@/authentication/type'
import { ConnectFailure } from '@/authentication/connectFlow'

// Why the merchant is back on the connect page: the saved credentials were
// rejected (deleted in the Control Centre), or they disconnected the shop.
export type ConnectNotice = 'credentialsRejected' | 'disconnected'

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
  // The Control Center window has closed and the shop is picking up its credentials
  isConnectFinishing: boolean
  connectError: Nullable<ConnectFailure>
  connectNotice: Nullable<ConnectNotice>
}

export interface IAuthStore {
  auth: IAuthState
  signIn: (request: IAuthRequest) => void
  connectWithControlCenter: () => void
  cancelConnectWithControlCenter: () => void
  setIsAuthLoading: (value: boolean) => void
  setUser: () => void
  refresh: (request: IAuthRequest) => void
  logout: (notice?: ConnectNotice) => void
  reLogin: () => void
}
