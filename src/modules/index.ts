import { AUTH_KEYS, DASHBOADR_KEYS } from '@/locales/types'
import LoginPage from '@/modules/auth'
import DashboardPageModule from '@/modules/dashboard'
import { IModule } from './type'

const modules: [IModule<AUTH_KEYS>, IModule<DASHBOADR_KEYS>] = [LoginPage, DashboardPageModule]

export default modules
