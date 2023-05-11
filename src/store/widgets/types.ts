import { IWidgets, IWidgetsChildren } from '@/baseLayers/types'
export interface IWidgetsState {
  widgets: IWidgets
  widgetsFromBL: IWidgets
  widgetsChildren: IWidgetsChildren[]
  widgetsFromAPI: IWidgetApi[]
  widgetsAreLoadedFromBL: boolean
  widgetsAreLoadedFromAPI: boolean
  isWidgetLoading: boolean
  eTrustedRefs: { accountRef: string; channelRef: string }
  isLoading: boolean
  widgetLocation: Array<IWidgetLocation>
  availableProductIds: Array<{ id: string; name: string }>
}
export interface IWidgetsStore {
  widgetState: IWidgetsState
  setETrustedChannelRef: (refs: { accountRef: string; channelRef: string }) => void
  setisWidgetLoading: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  getWidgetsFromBL: (value: IWidgets) => void
  getWidgetsFromAPI: () => void
  getWidgetLocation: (value: IWidgetLocation[]) => void
  updateWidgetLocation: (id: string, widgetLocation: IWidgetLocation) => void
  updateWidgetAttribute: (id: string, attributeName: string) => void
  updateWidgetsList: (updatedWidgets: IWidgetsChildren[]) => void
  mappingWidgetFromAPIandBL: () => void
  setAvailableProductIds: (value: Array<{ id: string; name: string }>) => void
  clearWidgetData: () => void
  updateWidgetExtensions: (id: string) => void
  clearWidgetState: () => void
}

export type WidgetChildren = IWidgetsChildren

export interface IWidgetLocation {
  id: string
  name: string
  key?: string
  availableForType?: string[]
}

export interface IWidgetApi {
  id: string
  application: {
    type: string
    url: string
    majorVersion: number
  }
  touchpoint: string
  configuration: {
    locale: string
    displayType: string
  }
  createdAt: string
  lastUpdatedAt: string
  integration: {
    bootstrapMajorVersion: number
    applicationType: string
    widget: {
      staticAttributes: {
        id: {
          value: string
          attributeName: string
        }
      }
      tag: string
    }
    widgetId: string
    applicationMajorVersion: number
    bootstrap: {
      staticAttributes: {
        src: {
          value: string
          attributeName: string
        }
        async: {
          attributeName: string
        }
        defer: {
          attributeName: string
        }
      }
      tag: string
    }
    version: number
    extensions: {
      product_star: {
        tag: string
      }
    }
  }
}
