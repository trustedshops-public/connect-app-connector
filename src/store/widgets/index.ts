import axios from 'axios'
import { GetState, SetState } from 'zustand'
import { getWidgets } from '@/api/api'

import { IWidgets, IWidgetsChildren } from '@/baseLayers/types'
import { IWidgetLocation, IWidgetsState, IWidgetApi, IWidgetsStore } from './types'

import { getParsedWidgetsData, widgetRootObj } from './parseWidgetsData'
import { getMappedWidgetLocation } from './getMappedWidgetLocation'
import { AppStore } from '../useStore'
import { WIDGET_LOCATIONS } from './widgtLocationConfig'

const PRODUCT_STAR_TAG = 'etrusted-product-review-list-widget-product-star-extension'

const initialState: IWidgetsState = {
  widgets: {} as IWidgets,
  widgetsFromBL: {} as IWidgets,
  widgetsFromAPI: [] as IWidgetApi[],
  widgetsChildren: [] as IWidgetsChildren[],
  widgetsAreLoadedFromBL: false,
  widgetsAreLoadedFromAPI: false,
  isLoading: false,
  eTrustedRefs: { accountRef: '', channelRef: '' },
  isWidgetLoading: false,
  widgetLocation: WIDGET_LOCATIONS as Array<IWidgetLocation>,
  availableProductIds: [] as Array<{ id: string; name: string }>,
}

export const widgetsStore = (set: SetState<AppStore>, get: GetState<AppStore>): IWidgetsStore => ({
  widgetState: initialState,
  clearWidgetState: () => {
    set(() => ({
      widgetState: {
        ...initialState,
      },
    }))
  },
  setETrustedChannelRef: (refs: { accountRef: string; channelRef: string }) => {
    set(store => ({ widgetState: { ...store.widgetState, eTrustedRefs: refs } }))
  },
  setIsLoading: (value: boolean) => {
    set(store => ({ widgetState: { ...store.widgetState, isLoading: value } }))
  },
  setisWidgetLoading: (value: boolean) => {
    set(store => ({ widgetState: { ...store.widgetState, isWidgetLoading: value } }))
  },
  setAvailableProductIds: (value: { id: string; name: string }[]) => {
    if (value && value.length) {
      set(store => ({
        widgetState: {
          ...store.widgetState,
          availableProductIds: value,
        },
      }))
    }
  },
  getWidgetsFromAPI: async () => {
    const userInfo = get().infoState.infoOfSystem

    if (!userInfo.allowsSupportWidgets) return

    set(store => ({
      widgetState: {
        ...store.widgetState,
        widgetsFromAPI: [],
        widgetsAreLoadedFromAPI: false,
        widgetsAreLoadedFromBL: false,
      },
    }))
    try {
      const refs = get().widgetState.eTrustedRefs
      const token = get().auth.user?.access_token
      const response = await getWidgets(refs, userInfo, token as string)
      set(store => ({
        ...store,
        widgetState: {
          ...store.widgetState,
          widgetsFromAPI: response.data,
          widgetsAreLoadedFromAPI: true,
        },
        auth: {
          ...store.auth,
          isRelogin: false,
        },
      }))
      if (get().widgetState.widgetsAreLoadedFromBL) {
        get().mappingWidgetFromAPIandBL()
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          get().reLogin()
          set(store => ({
            widgetState: {
              ...store.widgetState,
              widgetsAreLoadedFromAPI: true,
              isWidgetLoading: false,
            },
          }))
        }
      }
    }
  },
  getWidgetsFromBL: async (data: IWidgets) => {
    set(store => ({
      widgetState: {
        ...store.widgetState,
        widgetsFromBL: data || { children: [] },
        widgetsAreLoadedFromBL: true,
      },
    }))
    if (get().widgetState.widgetsAreLoadedFromAPI) {
      get().mappingWidgetFromAPIandBL()
    }
  },
  mappingWidgetFromAPIandBL: () => {
    const widgetsFromAPI = get().widgetState.widgetsFromAPI
    const widgetsFromBL = get().widgetState.widgetsFromBL
    const widgetLocation = get().widgetState.widgetLocation
    if (
      (!Array.isArray(widgetsFromBL.children) ||
        !widgetsFromBL.children.length ||
        !widgetsFromBL.children[0].children.length) &&
      !widgetsFromAPI.length
    ) {
      set(store => ({
        widgetState: {
          ...store.widgetState,
          widgetsChildren: [],
          widgets: { children: [{ children: [] }] },
          isWidgetLoading: false,
          isLoading: false,
        },
      }))
      return
    }
    const parsedWidgetsData = getParsedWidgetsData(widgetsFromBL, widgetsFromAPI, widgetLocation)

    set(store => ({
      widgetState: {
        ...store.widgetState,
        widgets: { children: [{ ...widgetRootObj, children: parsedWidgetsData }] },
        widgetsChildren: parsedWidgetsData,
        isWidgetLoading: false,
        isLoading: false,
      },
    }))
  },
  updateWidgetsList: (updatedWidgets: IWidgetsChildren[]) => {
    const widgets = get().widgetState.widgets
    widgets.children[0].children = updatedWidgets
    set(store => ({
      widgetState: {
        ...store.widgetState,
        widgets,
        widgetsChildren: updatedWidgets,
      },
    }))
  },
  updateWidgetLocation: (id: string, widgetLocation: IWidgetLocation) => {
    const widgets = get().widgetState.widgets
    const updatedWidgets = widgets.children[0].children.map((widget: IWidgetsChildren) =>
      widget.widgetId === id ? { ...widget, widgetLocation } : widget
    )
    get().updateWidgetsList(updatedWidgets)
  },
  updateWidgetAttribute: (id: string, attributeName: string) => {
    const widgets = get().widgetState.widgets
    const updatedWidgets = widgets.children[0].children.map((widget: IWidgetsChildren) =>
      widget.widgetId === id
        ? {
            ...widget,
            attributes: {
              ...widget.attributes,
              productIdentifier: { attributeName },
            },
          }
        : widget
    )
    get().updateWidgetsList(updatedWidgets)
  },
  updateWidgetExtensions: (id: string) => {
    const widgets = get().widgetState.widgets
    const updatedWidgets = widgets.children[0].children.map((widget: IWidgetsChildren) => {
      if (widget.extensions && widget.widgetId === id) {
        return {
          ...widget,
          extensions: {
            product_star: {
              tag: widget.extensions?.product_star.tag ? '' : PRODUCT_STAR_TAG,
            },
          },
        }
      }
      return widget
    })
    get().updateWidgetsList(updatedWidgets)
  },
  getWidgetLocation: (data: Array<IWidgetLocation>) => {
    set(store => ({
      widgetState: {
        ...store.widgetState,
        widgetLocation: getMappedWidgetLocation(WIDGET_LOCATIONS, data),
      },
    }))
  },
  clearWidgetData: () => {
    set(() => ({
      widgetState: initialState,
    }))
  },
})
