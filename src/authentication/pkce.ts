const base64url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...Array.from(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

// 32 random bytes give 43 base64url characters: enough for a PKCE verifier
// (43-128 characters) and for the state.
export const createRandomString = (byteLength = 32): string =>
  base64url(window.crypto.getRandomValues(new Uint8Array(byteLength)))

// PKCE S256: base64url(sha256(verifier)). Only the challenge leaves this page
// before the code is redeemed.
export const createCodeChallenge = async (verifier: string): Promise<string> =>
  base64url(
    new Uint8Array(
      await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)),
    ),
  )
