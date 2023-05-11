import { ComponentType } from 'preact'
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
