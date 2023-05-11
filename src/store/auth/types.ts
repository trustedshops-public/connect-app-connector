import { IAuthorizeResult } from '@/authentication/type'

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
}

export interface IAuthStore {
  auth: IAuthState
  signIn: (request: IAuthRequest) => void
  setIsAuthLoading: (value: boolean) => void
  setUser: () => void
  refresh: (request: IAuthRequest) => void
  logout: () => void
  reLogin: () => void
}
