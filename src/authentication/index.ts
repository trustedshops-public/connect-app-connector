/* eslint-disable no-console */
import axios, { AxiosInstance } from 'axios'
import { IAuthRequest } from '@/store/auth/types'
import { IUserInfo } from '@/store/info/types'

const PROXY_API_URL = process.env.VITE_PROXY_API_URL
const VERSION_NUMBER_OF_APP = process.env.VITE_VERSION_NUMBER_OF_APP
const NAME_OF_APP = process.env.VITE_NAME_OF_APP

class AuthenticationService {
  static api: AxiosInstance

  constructor(apiFetch: AxiosInstance) {
    AuthenticationService.api = apiFetch
  }

  async login(credentials: IAuthRequest, infoOfSystem?: IUserInfo) {
    const { clientId, clientSecret } = credentials
    const data = new URLSearchParams()
    data.append('grant_type', 'client_credentials')
    data.append('client_id', clientId.replace(/\s+/g, ''))
    data.append('client_secret', clientSecret.replace(/\s+/g, ''))
    data.append('audience', 'https://api.etrusted.com')

    try {
      const result = await AuthenticationService.api.post(`${PROXY_API_URL}/oauth/token`, data, {
        ...(infoOfSystem && {
          params: {
            'Trustedshops-ClientSystem': infoOfSystem.nameOfSystem,
            'Trustedshops-ClientSystemVersion': infoOfSystem.versionNumberOfSystem,
            'Trustedshops-ConnectorModule': NAME_OF_APP,
            'Trustedshops-ConnectorModuleVersion': VERSION_NUMBER_OF_APP,
          },
        }),
      })
      return result.data
    } catch (error) {
      console.info('error', error)
    }
  }
}

const instance = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const authenticationService = new AuthenticationService(instance)

export default authenticationService
