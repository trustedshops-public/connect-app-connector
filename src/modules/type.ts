import { ComponentType } from 'preact'
import { DASHBOARD_KEYS } from '@/locales/types'
export interface IModule<T> {
  routeProps: {
    path: string
    component: ComponentType<{
      setPhrasesByKey: (keys: T) => void
      phrasesByKey: T
    }>
  }
  name: string
}

export interface TabProps {
  phrasesByKey: DASHBOARD_KEYS
}
