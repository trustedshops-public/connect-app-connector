import { GetState, SetState } from 'zustand'
import authenticationService from '@/authentication'
import { IAuthorizeResult } from '@/authentication/type'
import {
  cancelConnect,
  connectFailureOf,
  connectWithControlCenter as openControlCenterConnect,
  takeRedirectResult,
} from '@/authentication/connectFlow'
import { dispatchAction, EVENTS } from '@/eventsLib'
import { getSecondsNow } from '@/helpers'
import { AppStore } from '../useStore'
import { IAuthRequest, IAuthState, IAuthStore } from './types'

const initialState: IAuthState = {
  user: null as Nullable<IAuthorizeResult>,
  isAuthLoading: true,
  isAuthFailed: false,
  isAuthenticated: false,
  isAuthError: false,
  isRelogin: false,
  isConnecting: false,
  connectError: null,
}

export const authStore = (set: SetState<AppStore>, get: GetState<AppStore>): IAuthStore => ({
  auth: initialState,
  setIsAuthLoading: (value: boolean) => {
    set(store => ({
      auth: {
        ...store.auth,
        isAuthLoading: value,
      },
    }))
  },
  reLogin: async () => {
    if (get().auth.isRelogin) return
    set(store => ({
      auth: {
        ...store.auth,
        isAuthenticated: false,
        isAuthLoading: true,
        isAuthFailed: false,
        user: null,
        isRelogin: true,
      },
    }))
    dispatchAction({ action: EVENTS.GET_CREDENTIALS_PROVIDED, payload: null })
  },
  setUser: async () => {
    // Back from a "Connect with Trusted Shops" redirect: log in with the new
    // credentials instead of the stored ones.
    const redirectResult = takeRedirectResult()
    if (redirectResult) {
      set(store => ({ auth: { ...store.auth, isAuthLoading: true, connectError: null } }))
      try {
        await get().signIn(await redirectResult)
        return
      } catch (error) {
        set(store => ({ auth: { ...store.auth, connectError: connectFailureOf(error) } }))
      }
    }
    const user = get().auth.user
    if (user && user.access_token) {
      set(store => ({
        auth: {
          ...store.auth,
          user,
          isAuthenticated: true,
          isAuthLoading: false,
        },
      }))
      if (user.expiration_time < getSecondsNow()) {
        dispatchAction({ action: EVENTS.GET_CREDENTIALS_PROVIDED, payload: null })
      }
    } else {
      dispatchAction({ action: EVENTS.GET_CREDENTIALS_PROVIDED, payload: null })
      set(store => ({ auth: { ...store.auth, isAuthenticated: false } }))
    }
  },
  signIn: async (request: IAuthRequest) => {
    const trimmedRequestCredentials = {
      clientId: request?.clientId.replace(/\s+/g, ''),
      clientSecret: request?.clientSecret.replace(/\s+/g, ''),
    }
    const infoOfSystem = get().infoState.infoOfSystem
    set(store => ({ auth: { ...store.auth, isAuthLoading: true } }))
    const response = await authenticationService.login(trimmedRequestCredentials, infoOfSystem)
    if (!response) {
      set(store => ({
        auth: { ...store.auth, isAuthFailed: true, isAuthLoading: false },
      }))
      return
    }
    dispatchAction({ action: EVENTS.SAVE_CREDENTIALS, payload: trimmedRequestCredentials })
    const expiration_time = getSecondsNow() + response.expires_in - 300
    const result: IAuthorizeResult = { ...response, expiration_time }

    set(store => ({
      auth: {
        ...store.auth,
        user: result,
        isAuthenticated: true,
        isAuthLoading: false,
      },
    }))
  },
  connectWithControlCenter: async () => {
    const { nameOfSystem, versionNumberOfSystem } = get().infoState.infoOfSystem
    // Opens the Control Center popup synchronously, inside the click that
    // called this action; the browser blocks popups opened after an await.
    const connecting = openControlCenterConnect({ nameOfSystem, versionNumberOfSystem })
    set(store => ({
      auth: { ...store.auth, isConnecting: true, connectError: null, isAuthFailed: false },
    }))
    try {
      const credentials = await connecting
      set(store => ({ auth: { ...store.auth, isConnecting: false } }))
      await get().signIn(credentials)
    } catch (error) {
      const reason = connectFailureOf(error)
      set(store => ({
        auth: {
          ...store.auth,
          isConnecting: false,
          connectError: reason === 'cancelled' ? null : reason,
        },
      }))
    }
  },
  cancelConnectWithControlCenter: () => {
    cancelConnect()
  },
  refresh: async (request: IAuthRequest) => {
    const infoOfSystem = get().infoState.infoOfSystem
    const trimmedRequestCredentials = {
      clientId: request?.clientId.replace(/\s+/g, ''),
      clientSecret: request?.clientSecret.replace(/\s+/g, ''),
    }
    try {
      const response = await authenticationService.login(trimmedRequestCredentials, infoOfSystem)
      if (!response) {
        set(store => ({
          auth: { ...store.auth, isAuthFailed: true, isAuthLoading: false, isRelogin: false },
        }))
        return
      }
      const expiration_time = getSecondsNow() + response.expires_in - 300
      const result: IAuthorizeResult = { ...response, expiration_time }

      set(store => ({
        auth: {
          ...store.auth,
          user: result,
          isAuthenticated: true,
          isAuthLoading: false,
        },
      }))
    } catch (error) {
      get().logout()
    }
  },
  logout: async () => {
    set(store => ({
      auth: {
        ...store.auth,
        isAuthenticated: false,
        isAuthLoading: false,
        isAuthFailed: false,
        user: null,
      },
    }))

    get().clearChannelState()
    get().clearNotificationState()
    get().clearReviewInvitesState()
    get().clearTrustbadgeState()
    get().clearWidgetState()
  },
})
