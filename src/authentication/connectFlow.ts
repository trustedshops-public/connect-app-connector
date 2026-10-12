import axios from 'axios'
import { IAuthRequest } from '@/store/auth/types'
import { createCodeChallenge, createRandomString } from './pkce'

/**
 * "Connect with Trusted Shops": instead of copying a client ID and secret, the
 * merchant approves this shop on the Control Center's plugin connections page
 * (tswp-connect-plugin-connections). That page hands back a one-time code,
 * which is redeemed here, together with the PKCE verifier, for the client
 * credentials. The rest is the existing login: signIn() fetches the token and
 * the base layer stores the credentials through SAVE_CREDENTIALS, so no base
 * layer changes.
 *
 * The Control Center opens in a popup, so the shop admin stays where it is. If
 * the browser blocks the popup, the whole tab goes to the Control Center and
 * comes back with the code in the URL (see takeRedirectResult).
 *
 * The request and result parameters are the contract in that repo's
 * src/contracts/connect.ts. Keep both sides in sync.
 */

const CC_CONNECT_URL = process.env.VITE_CC_CONNECT_URL
const CONNECT_API_URL = process.env.VITE_CONNECT_API_URL

const POPUP_NAME = 'ts-connect'
const POPUP_FEATURES = 'popup,width=760,height=880'
const POPUP_CLOSED_POLL_MS = 500
const MESSAGE_TYPE = 'ts-connect'
const PENDING_REDIRECT_KEY = 'ts-connect-pending'
const RESULT_PARAMS = {
  state: 'ts_connect_state',
  code: 'ts_connect_code',
  error: 'ts_connect_error',
}

export type ConnectFailure = 'popup_blocked' | 'closed' | 'access_denied' | 'failed' | 'cancelled'

export class ConnectError extends Error {
  readonly reason: ConnectFailure

  constructor(reason: ConnectFailure) {
    super(`Connect with Trusted Shops failed: ${reason}`)
    this.reason = reason
  }
}

export const connectFailureOf = (error: unknown): ConnectFailure =>
  error instanceof ConnectError ? error.reason : 'failed'

interface SystemInfo {
  nameOfSystem: string
  versionNumberOfSystem?: string
}

// Off unless both URLs are configured, and PKCE needs Web Crypto, which
// browsers only offer on https pages and on localhost.
export const isConnectFlowAvailable = (): boolean =>
  Boolean(CC_CONNECT_URL && CONNECT_API_URL && window.crypto?.subtle)

const controlCenterOrigin = (): string => new URL(CC_CONNECT_URL as string).origin

const buildConnectUrl = (params: {
  mode: 'popup' | 'redirect'
  state: string
  challenge: string
  system: SystemInfo
  target: string
}): string => {
  const url = new URL(CC_CONNECT_URL as string)
  url.searchParams.set('mode', params.mode)
  url.searchParams.set('state', params.state)
  url.searchParams.set('code_challenge', params.challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('system', params.system.nameOfSystem)
  if (params.system.versionNumberOfSystem) {
    url.searchParams.set('system_version', params.system.versionNumberOfSystem)
  }
  url.searchParams.set('shop', window.location.host)
  url.searchParams.set(params.mode === 'popup' ? 'origin' : 'return_url', params.target)
  return url.toString()
}

const redeemCode = async (code: string, codeVerifier: string): Promise<IAuthRequest> => {
  try {
    const { data } = await axios.post(`${CONNECT_API_URL}/connect/token`, { code, codeVerifier })
    if (typeof data?.clientId !== 'string' || typeof data?.clientSecret !== 'string') {
      throw new ConnectError('failed')
    }
    return { clientId: data.clientId, clientSecret: data.clientSecret }
  } catch {
    throw new ConnectError('failed')
  }
}

let abortActiveConnect: Nullable<() => void> = null

// Closes the Control Center window and gives up on the pending connect.
export const cancelConnect = (): void => {
  abortActiveConnect?.()
}

const waitForCode = (popup: Window, state: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const origin = controlCenterOrigin()

    // Only the window we opened, on the Control Center's origin, answering
    // this very request, may hand over a code.
    const onMessage = (event: MessageEvent): void => {
      const data = event.data
      if (event.origin !== origin || event.source !== popup) return
      if (data?.type !== MESSAGE_TYPE || data.state !== state) return
      finish()
      if (typeof data.code === 'string' && data.code) {
        resolve(data.code)
      } else {
        reject(new ConnectError(data.error === 'access_denied' ? 'access_denied' : 'failed'))
      }
    }
    const closedPoll = setInterval(() => {
      if (popup.closed) {
        finish()
        reject(new ConnectError('closed'))
      }
    }, POPUP_CLOSED_POLL_MS)
    const finish = (): void => {
      window.removeEventListener('message', onMessage)
      clearInterval(closedPoll)
      abortActiveConnect = null
    }

    window.addEventListener('message', onMessage)
    abortActiveConnect = () => {
      finish()
      popup.close()
      reject(new ConnectError('cancelled'))
    }
  })

const startRedirectConnect = async (system: SystemInfo): Promise<never> => {
  const state = createRandomString()
  const verifier = createRandomString()
  const challenge = await createCodeChallenge(verifier)
  sessionStorage.setItem(PENDING_REDIRECT_KEY, JSON.stringify({ state, verifier }))
  window.location.assign(
    buildConnectUrl({ mode: 'redirect', state, challenge, system, target: window.location.href }),
  )
  // The tab is leaving; takeRedirectResult() picks up when it comes back.
  return new Promise<never>(() => undefined)
}

/**
 * Opens the Control Center, waits for the merchant to approve this shop and
 * returns its client credentials. Call it straight from the click handler:
 * the popup has to open before the first await, or the browser blocks it.
 */
export const connectWithControlCenter = async (system: SystemInfo): Promise<IAuthRequest> => {
  const popup = window.open('', POPUP_NAME, POPUP_FEATURES)
  if (!popup) {
    // Sending the tab away only works when the connector is the page itself.
    // Inside a shop admin's iframe we can't know the admin URL to come back to.
    if (window.top === window.self) return startRedirectConnect(system)
    throw new ConnectError('popup_blocked')
  }

  const state = createRandomString()
  const verifier = createRandomString()
  try {
    const challenge = await createCodeChallenge(verifier)
    popup.location.href = buildConnectUrl({
      mode: 'popup',
      state,
      challenge,
      system,
      target: window.location.origin,
    })
  } catch {
    popup.close()
    throw new ConnectError('failed')
  }
  popup.focus()

  const code = await waitForCode(popup, state)
  return redeemCode(code, verifier)
}

/**
 * After a redirect connect, the Control Center sends the tab back with the
 * result in the URL. Returns the credentials for that result, or null when the
 * URL carries none. Removes the result from the URL either way.
 */
export const takeRedirectResult = (): Nullable<Promise<IAuthRequest>> => {
  const url = new URL(window.location.href)
  const state = url.searchParams.get(RESULT_PARAMS.state)
  if (!state) return null
  const code = url.searchParams.get(RESULT_PARAMS.code)
  const error = url.searchParams.get(RESULT_PARAMS.error)
  Object.values(RESULT_PARAMS).forEach(name => url.searchParams.delete(name))
  window.history.replaceState(window.history.state, '', url.toString())

  let pending: Nullable<{ state: string; verifier: string }> = null
  try {
    pending = JSON.parse(sessionStorage.getItem(PENDING_REDIRECT_KEY) || 'null')
  } catch {
    pending = null
  }
  sessionStorage.removeItem(PENDING_REDIRECT_KEY)

  // A result for a request this tab didn't make is ignored.
  if (!pending || pending.state !== state) {
    return Promise.reject(new ConnectError('failed'))
  }
  if (!code) {
    return Promise.reject(new ConnectError(error === 'access_denied' ? 'access_denied' : 'failed'))
  }
  return redeemCode(code, pending.verifier)
}
