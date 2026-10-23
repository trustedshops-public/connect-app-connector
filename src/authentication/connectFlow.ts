import axios from 'axios'
import { IAuthRequest } from '@/store/auth/types'
import { createCodeChallenge, createRandomString } from './pkce'

/**
 * "Connect with Trusted Shops": instead of copying a client ID and secret, the
 * merchant approves this shop on the Control Center's plugin connections page
 * (tswp-connect-plugin-connections). That page asks connect-middleware to
 * provision credentials for this request's PKCE challenge. Meanwhile this page
 * polls the backend's status for the challenge, and once it is ready, redeems
 * the credentials with the verifier. The rest is the existing login: signIn()
 * fetches the token and the base layer stores the credentials through
 * SAVE_CREDENTIALS, so no base layer changes.
 *
 * The Control Center opens in a popup, so the shop admin stays where it is.
 * The popup asks which shop opened it (ts-connect-ready), and this page
 * answers with the challenge (ts-connect-hello); if the merchant cancels, it
 * says so (ts-connect-ended) and this page stops waiting. The request names the shop
 * system and, when known, the shop's address (shop_url, see shopUrlOf), which
 * the popup shows the merchant. If the browser blocks the popup, the whole
 * tab goes to the Control Center and comes back with the result in the URL
 * (see takeRedirectResult).
 *
 * The request and message names are the contract in that repo's
 * src/contracts/connect.ts. The backend calls are connect-middleware's
 * /sso-clients/status and /redeem (its infrastructure/service/module/openapi.yaml).
 */

const CC_CONNECT_URL = process.env.VITE_CC_CONNECT_URL
const MIDDLEWARE_API_URL = process.env.VITE_MIDDLEWARE_API_URL

const POPUP_NAME = 'ts-connect'
const POPUP_FEATURES = 'popup,width=760,height=880'
const POPUP_CLOSED_POLL_MS = 500
const STATUS_POLL_MS = 2000
// How long to keep checking after the popup closed. The Control Center
// closes it after the backend answered "ready", so the first check usually
// succeeds; this also covers a popup closed while the backend was still
// provisioning (its request times out after 29 s). A popup closed without
// approving never gets "ready" and ends as "closed" after this.
const CLOSED_GRACE_MS = 30_000
// The backend keeps a session for 5 minutes.
const SESSION_TIMEOUT_MS = 5 * 60 * 1000
// The redeem route answers 503 while it is throttled: retry shortly.
const REDEEM_ATTEMPTS = 4
const REDEEM_RETRY_MS = 1500
const MESSAGES = { ready: 'ts-connect-ready', hello: 'ts-connect-hello', ended: 'ts-connect-ended' }
const PENDING_REDIRECT_KEY = 'ts-connect-pending'
const RESULT_PARAM = 'ts_connect'

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
  shopUrl?: string
}

// Hosts that serve a Trusted Shops app rather than the shop itself, such as
// the Shopify app, so this page's own address isn't the shop there.
const APP_HOST_DOMAINS = [
  'trustedshops.com',
  'trustedshops.de',
  'etrusted.com',
  'etrusted.site',
  'etrusted.koeln',
  'cloudfront.net',
  'amazonaws.com',
]
const isAppHost = (hostname: string): boolean =>
  APP_HOST_DOMAINS.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))
const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1']
const MYSHOPIFY_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/

/**
 * The shop's address for the Control Center's approval, or undefined when it
 * isn't known; the approval then names only the plugin. The base layer's, if
 * it sends one. For Shopify, the shop parameter Shopify gives every embedded
 * app. Otherwise this page's host, which is the shop admin's for plugins that
 * run inside it.
 */
export const shopUrlOf = (info: {
  nameOfSystem?: string
  shopUrl?: string
}): string | undefined => {
  if (info.shopUrl) return info.shopUrl
  if (info.nameOfSystem?.toLowerCase() === 'shopify') {
    const shop = new URLSearchParams(window.location.search).get('shop')?.toLowerCase()
    return shop && MYSHOPIFY_PATTERN.test(shop) ? `https://${shop}` : undefined
  }
  const { hostname, origin } = window.location
  if (LOCAL_HOSTNAMES.includes(hostname) || isAppHost(hostname)) return undefined
  return origin
}

// redeemed: someone already picked the credentials up; for this page, that is
// a failure, since it only redeems after it saw "ready".
type SessionStatus = 'pending' | 'ready' | 'failed'

// Off unless both URLs are configured, and PKCE needs Web Crypto, which
// browsers only offer on https pages and on localhost.
export const isConnectFlowAvailable = (): boolean =>
  Boolean(CC_CONNECT_URL && MIDDLEWARE_API_URL && window.crypto?.subtle)

const controlCenterOrigin = (): string => new URL(CC_CONNECT_URL as string).origin

/**
 * The Control Center page that hands out credentials to copy into this plugin
 * by hand (mode=manual), or null where the connect flow is switched off.
 */
export const buildManualCredentialsUrl = (system: SystemInfo): Nullable<string> => {
  if (!CC_CONNECT_URL || !system.nameOfSystem) return null
  const url = new URL(CC_CONNECT_URL)
  url.searchParams.set('mode', 'manual')
  url.searchParams.set('system', system.nameOfSystem)
  if (system.versionNumberOfSystem) {
    url.searchParams.set('system_version', system.versionNumberOfSystem)
  }
  return url.toString()
}

const buildConnectUrl = (params: {
  mode: 'popup' | 'redirect'
  challenge: string
  system: SystemInfo
  returnUrl?: string
}): string => {
  const url = new URL(CC_CONNECT_URL as string)
  url.searchParams.set('mode', params.mode)
  url.searchParams.set('code_challenge', params.challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('system', params.system.nameOfSystem)
  if (params.system.versionNumberOfSystem) {
    url.searchParams.set('system_version', params.system.versionNumberOfSystem)
  }
  if (params.system.shopUrl) url.searchParams.set('shop_url', params.system.shopUrl)
  if (params.returnUrl) url.searchParams.set('return_url', params.returnUrl)
  return url.toString()
}

const getStatus = async (challenge: string): Promise<SessionStatus> => {
  try {
    const { data } = await axios.post(`${MIDDLEWARE_API_URL}/sso-clients/status`, { challenge })
    if (data?.status === 'ready') return 'ready'
    if (data?.status === 'failed' || data?.status === 'redeemed') return 'failed'
    return 'pending'
  } catch {
    // A failed poll is not a failed session: try again on the next tick.
    return 'pending'
  }
}

const redeem = async (challenge: string, verifier: string): Promise<IAuthRequest> => {
  for (let attempt = 1; ; attempt++) {
    try {
      const { data } = await axios.post(`${MIDDLEWARE_API_URL}/sso-clients/redeem`, {
        challenge,
        verifier,
      })
      if (typeof data?.clientId !== 'string' || typeof data?.clientSecret !== 'string') {
        throw new ConnectError('failed')
      }
      return { clientId: data.clientId, clientSecret: data.clientSecret }
    } catch (error) {
      const throttled = axios.isAxiosError(error) && error.response?.status === 503
      if (!throttled || attempt >= REDEEM_ATTEMPTS) throw new ConnectError('failed')
      await new Promise(resolve => setTimeout(resolve, REDEEM_RETRY_MS))
    }
  }
}

let abortActiveConnect: Nullable<() => void> = null
let activePopup: Nullable<Window> = null

// Closes the Control Center window and gives up on the pending connect.
export const cancelConnect = (): void => {
  abortActiveConnect?.()
}

// "Window not showing?": brings the Control Center window of the pending
// connect to the front. Opening by name reuses that window without reloading it.
export const focusConnectWindow = (): void => {
  if (!activePopup || activePopup.closed) return
  ;(window.open('', POPUP_NAME, POPUP_FEATURES) ?? activePopup).focus()
}

/**
 * Answers the popup's handshake and, once the popup is closed, polls the
 * backend until the merchant's approval is provisioned. No status calls while
 * the popup is open. Resolves when the session is ready.
 */
const waitForApproval = (
  popup: Window,
  challenge: string,
  onPopupClosed?: () => void,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const origin = controlCenterOrigin()
    let statusPoll: Nullable<ReturnType<typeof setTimeout>> = null
    let done = false

    // Only the window we opened, on the Control Center's origin, gets the
    // challenge, and only the Control Center's origin can read it. When the
    // merchant cancels there, or closes it after a failure, the popup says so
    // (ended), and the connect ends right away without a status check.
    const onMessage = (event: MessageEvent): void => {
      if (event.origin !== origin || event.source !== popup) return
      if (event.data?.type === MESSAGES.ready) {
        popup.postMessage({ type: MESSAGES.hello, challenge }, origin)
      } else if (event.data?.type === MESSAGES.ended && event.data.challenge === challenge) {
        finish(new ConnectError(event.data.result === 'failed' ? 'failed' : 'access_denied'))
      }
    }

    const finish = (error?: ConnectError): void => {
      if (done) return
      done = true
      window.removeEventListener('message', onMessage)
      clearInterval(closedPoll)
      if (statusPoll) clearTimeout(statusPoll)
      abortActiveConnect = null
      activePopup = null
      if (error) reject(error)
      else resolve()
    }

    // After the popup closed: check now, then every few seconds until the
    // session is ready or failed, or the grace period is over.
    const pollAfterClose = (): void => {
      const deadline = Date.now() + CLOSED_GRACE_MS
      const check = async (): Promise<void> => {
        const status = await getStatus(challenge)
        if (done) return
        if (status === 'ready') return finish()
        if (status === 'failed') return finish(new ConnectError('failed'))
        if (Date.now() >= deadline) return finish(new ConnectError('closed'))
        statusPoll = setTimeout(() => void check(), STATUS_POLL_MS)
      }
      void check()
    }

    const closedPoll = setInterval(() => {
      if (!popup.closed || done) return
      clearInterval(closedPoll)
      onPopupClosed?.()
      pollAfterClose()
    }, POPUP_CLOSED_POLL_MS)

    window.addEventListener('message', onMessage)
    activePopup = popup
    abortActiveConnect = () => {
      popup.close()
      finish(new ConnectError('cancelled'))
    }
  })

const startRedirectConnect = async (system: SystemInfo): Promise<never> => {
  const verifier = createRandomString()
  const challenge = await createCodeChallenge(verifier)
  sessionStorage.setItem(PENDING_REDIRECT_KEY, JSON.stringify({ challenge, verifier }))
  window.location.assign(
    buildConnectUrl({ mode: 'redirect', challenge, system, returnUrl: window.location.href }),
  )
  // The tab is leaving; takeRedirectResult() picks up when it comes back.
  return new Promise<never>(() => undefined)
}

/**
 * Opens the Control Center, waits for the merchant to approve this shop and
 * returns its client credentials. Call it straight from the click handler:
 * the popup has to open before the first await, or the browser blocks it.
 * onPopupClosed runs once the window is gone and the result is being checked.
 */
export const connectWithControlCenter = async (
  system: SystemInfo,
  onPopupClosed?: () => void,
): Promise<IAuthRequest> => {
  const popup = window.open('', POPUP_NAME, POPUP_FEATURES)
  if (!popup) {
    // Sending the tab away only works when the connector is the page itself.
    // Inside a shop admin's iframe we can't know the admin URL to come back to.
    if (window.top === window.self) return startRedirectConnect(system)
    throw new ConnectError('popup_blocked')
  }

  const verifier = createRandomString()
  let challenge: string
  try {
    challenge = await createCodeChallenge(verifier)
    popup.location.href = buildConnectUrl({ mode: 'popup', challenge, system })
  } catch {
    popup.close()
    throw new ConnectError('failed')
  }
  popup.focus()

  await waitForApproval(popup, challenge, onPopupClosed)
  return redeem(challenge, verifier)
}

const waitUntilReady = async (challenge: string): Promise<void> => {
  const deadline = Date.now() + SESSION_TIMEOUT_MS
  for (;;) {
    const status = await getStatus(challenge)
    if (status === 'ready') return
    if (status === 'failed' || Date.now() > deadline) throw new ConnectError('failed')
    await new Promise(resolve => setTimeout(resolve, STATUS_POLL_MS))
  }
}

/**
 * After a redirect connect, the Control Center sends the tab back with
 * ts_connect=done or cancelled in the URL. Returns the credentials for that
 * result, or null when the URL carries none. Removes the result from the URL
 * either way.
 */
export const takeRedirectResult = (): Nullable<Promise<IAuthRequest>> => {
  const url = new URL(window.location.href)
  const result = url.searchParams.get(RESULT_PARAM)
  if (!result) return null
  url.searchParams.delete(RESULT_PARAM)
  window.history.replaceState(window.history.state, '', url.toString())

  let pending: Nullable<{ challenge: string; verifier: string }> = null
  try {
    pending = JSON.parse(sessionStorage.getItem(PENDING_REDIRECT_KEY) || 'null')
  } catch {
    pending = null
  }
  sessionStorage.removeItem(PENDING_REDIRECT_KEY)

  // A result for a request this tab didn't make is ignored.
  if (!pending?.challenge || !pending.verifier) {
    return Promise.reject(new ConnectError('failed'))
  }
  if (result !== 'done') return Promise.reject(new ConnectError('access_denied'))
  const { challenge, verifier } = pending
  return waitUntilReady(challenge).then(() => redeem(challenge, verifier))
}
