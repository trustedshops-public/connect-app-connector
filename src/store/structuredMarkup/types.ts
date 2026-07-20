import { IMappedChannel } from '../channel/types'

export interface IStructuredMarkupState {
  structuredMarkupEnabled: boolean
  isLoadingStructuredMarkup: boolean
}

export interface IStructuredMarkupStore {
  structuredMarkupState: IStructuredMarkupState
  setStructuredMarkupEnabled: (value: boolean) => void
  setStructuredMarkupLoading: (value: boolean) => void
  getStructuredMarkupConfiguration: (channel: IMappedChannel) => void
  updateStructuredMarkupEnabled: (
    enabled: boolean,
    options?: { skipConfigurationCall?: boolean },
  ) => void
  clearStructuredMarkupState: () => void
}
