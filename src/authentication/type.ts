export interface IAuthorizeResult {
  access_token: string
  expires_in: number
  expiration_time: number
  refresh_expires_in: number
  scope: string
  session_state: string
  token_type: string
}
