import { IWidgets } from '@/baseLayers/types'
import { Content, PRODUCT_REVIEW_APPLICATION_TYPES } from '@/modules/dashboard/tabWidgets/widgetRow'
import { IWidgetApi, IWidgetLocation, WidgetChildren } from './types'
import { TypeReview } from './widgtLocationConfig'
const STAGE = process.env.VITE_CONTROL_CENTER_STAGE

export const widgetRootObj = {
  tag: 'script',
  attributes: {
    src: {
      value: `https://integrations.etrusted.${STAGE}/applications/widget.js/v2`,
      attributeName: 'src',
    },
    async: {
      attributeName: 'async',
    },
    defer: {
      attributeName: 'defer',
    },
  },
}

export const getParsedWidgetsData = (
  widgetsFromBL: IWidgets,
  widgetsFromAPI: IWidgetApi[],
  widgetLocation: IWidgetLocation[]
): WidgetChildren[] => {
  let accWBL: WidgetChildren[] = []
  if (widgetsFromBL.children.length && widgetsFromBL.children[0].children) {
    accWBL = widgetsFromBL.children[0].children.reduce(
      (acc: WidgetChildren[], widget): WidgetChildren[] => {
        const widgetHasPropertyProductIdentifier =
          [TypeReview.service].includes(Content[widget.applicationType]) &&
          Object.prototype.hasOwnProperty.call(widget.attributes, 'productIdentifier')

        if (widgetLocation.some(loc => loc.id === widget.widgetLocation?.id)) {
          acc.push({
            ...widget,
            ...(widgetHasPropertyProductIdentifier && {
              attributes: { id: widget.attributes?.id } as {
                [key: string]: { value?: string; attributeName?: string }
              },
            }),
          })
        } else {
          acc.push({
            ...widget,
            widgetLocation: { id: '', name: '' },
            ...(widgetHasPropertyProductIdentifier && {
              attributes: { id: widget.attributes?.id } as {
                [key: string]: { value?: string; attributeName?: string }
              },
            }),
          })
        }
        return acc
      },
      []
    )
  }

  const accW = widgetsFromAPI.reduce((acc: WidgetChildren[], widget): WidgetChildren[] => {
    if (!Content[widget.application.type]) return acc

    let index = -1
    if (widgetsFromBL.children.length && widgetsFromBL.children[0].children) {
      index = widgetsFromBL.children[0].children.findIndex(el => el.widgetId === widget.id)
    }
    if (index === -1) {
      acc.push({
        tag: widget.integration.widget.tag,
        attributes: {
          ...widget.integration.widget.staticAttributes,
          ...(PRODUCT_REVIEW_APPLICATION_TYPES.includes(widget.integration.applicationType)
            ? {
                productIdentifier: {
                  attributeName: '',
                },
              }
            : {}),
        },
        extensions: {
          ...widget.integration.extensions,
        },
        widgetId: widget.id,
        applicationType: widget.integration.applicationType,
      })
    }
    return acc
  }, [])

  return [...accWBL, ...accW]
}
