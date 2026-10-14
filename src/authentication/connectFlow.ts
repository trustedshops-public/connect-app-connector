import axios from 'axios'
import { IAuthRequest } from '@/store/auth/types'
import { createCodeChallenge, createRandomString } from './pkce'

/**
 * "Connect with Trusted Shops": instead of copying a client ID and secret, the
 * merchant approves this shop on the Control Center's plugin connections page
 * (tswp-connect-plugin-connections). That page asks the connect backend to
 * provision credentials for this request's PKCE challenge. Meanwhile this page
 * polls the backend's status for the challenge, and once it is ready, redeems
 * the credentials with the verifier. The rest is the existing login: signIn()
 * fetches the token and the base layer stores the credentials through
 * SAVE_CREDENTIALS, so no base layer changes.
 *
 * The Control Center opens in a popup, so the shop admin stays where it is.
 * The popup asks which shop opened it (ts-connect-ready), and this page
 * answers with the challenge (ts-connect-hello); the browser adds this page's
 * origin, which the popup shows the merchant. If the browser blocks the
 * popup, the whole tab goes to the Control Center and comes back with the
 * result in the URL (see takeRedirectResult).
 *
 * The request and message names are the contract in that repo's
 * src/contracts/connect.ts, the backend calls its src/contracts/ssoClients.ts.
 * Keep both sides in sync.
 */

const CC_CONNECT_URL = process.env.VITE_CC_CONNECT_URL
const CONNECT_API_URL = process.env.VITE_CONNECT_API_URL

const POPUP_NAME = 'ts-connect'
const POPUP_FEATURES = 'popup,width=760,height=880'
const POPUP_CLOSED_POLL_MS = 500
const STATUS_POLL_MS = 2000
// The backend keeps a session for 5 minutes.
const SESSION_TIMEOUT_MS = 5 * 60 * 1000
const MESSAGES = { ready: 'ts-connect-ready', hello: 'ts-connect-hello' }
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
}

type SessionStatus = 'pending' | 'ready' | 'failed'

// Off unless both URLs are configured, and PKCE needs Web Crypto, which
// browsers only offer on https pages and on localhost.
export const isConnectFlowAvailable = (): boolean =>
  Boolean(CC_CONNECT_URL && CONNECT_API_URL && window.crypto?.subtle)

const controlCenterOrigin = (): string => new URL(CC_CONNECT_URL as string).origin

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
  if (params.returnUrl) url.searchParams.set('return_url', params.returnUrl)
  return url.toString()
}

const getStatus = async (challenge: string): Promise<SessionStatus> => {
  try {
    const { data } = await axios.post(`${CONNECT_API_URL}/sso-clients/status`, { challenge })
    return data?.status === 'ready' || data?.status === 'failed' ? data.status : 'pending'
  } catch {
    // A failed poll is not a failed session: try again on the next tick.
    return 'pending'
  }
}

const redeem = async (challenge: string, verifier: string): Promise<IAuthRequest> => {
  try {
    const { data } = await axios.post(`${CONNECT_API_URL}/sso-clients/redeem`, {
      challenge,
      verifier,
    })
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

/**
 * Answers the popup's handshake and polls the backend until the merchant's
 * approval is provisioned. Resolves when the session is ready.
 */
const waitForApproval = (popup: Window, challenge: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const origin = controlCenterOrigin()
    const deadline = Date.now() + SESSION_TIMEOUT_MS
    let polling = false
    let done = false

    // Only the window we opened, on the Control Center's origin, gets the
    // challenge, and only the Control Center's origin can read it.
    const onMessage = (event: MessageEvent): void => {
      if (event.origin !== origin || event.source !== popup) return
      if (event.data?.type !== MESSAGES.ready) return
      popup.postMessage({ type: MESSAGES.hello, challenge }, origin)
    }

    const finish = (error?: ConnectError): void => {
      if (done) return
      done = true
      window.removeEventListener('message', onMessage)
      clearInterval(statusPoll)
      clearInterval(closedPoll)
      abortActiveConnect = null
      if (error) reject(error)
      else resolve()
    }

    const check = async (): Promise<SessionStatus> => {
      if (polling) return 'pending'
      polling = true
      const status = await getStatus(challenge)
      polling = false
      if (status === 'ready') finish()
      else if (status === 'failed') finish(new ConnectError('failed'))
      else if (Date.now() > deadline) finish(new ConnectError('failed'))
      return status
    }

    const statusPoll = setInterval(() => void check(), STATUS_POLL_MS)
    // The popup closes itself once the shop is connected, which may be just
    // before the next poll: look once more before calling it closed.
    const closedPoll = setInterval(() => {
      if (!popup.closed || done) return
      clearInterval(closedPoll)
      clearInterval(statusPoll)
      polling = false
      void check().then(status => {
        if (status === 'pending') finish(new ConnectError('closed'))
      })
    }, POPUP_CLOSED_POLL_MS)

    window.addEventListener('message', onMessage)
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
 */
export const connectWithControlCenter = async (system: SystemInfo): Promise<IAuthRequest> => {
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

  await waitForApproval(popup, challenge)
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
