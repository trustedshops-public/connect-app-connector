import { IWidgetLocation } from './types'
import { TypeReview } from './widgtLocationConfig'

export const getMappedWidgetLocation = (
  locationDefault: IWidgetLocation[],
  locationBL: IWidgetLocation[]
): IWidgetLocation[] => {
  if (!locationBL || !locationBL.length) {
    return locationDefault
  }

  if (locationBL.some(r => locationDefault.findIndex(item => item.id === r.id) >= 0)) {
    return locationBL.map(loc => {
      const findedLocation = locationDefault.find(item => item.id === loc.id)
      return {
        ...loc,
        key: findedLocation?.key || '',
        availableForType: findedLocation?.availableForType || [
          TypeReview.service,
          TypeReview.product,
        ],
      }
    })
  }
  return [...locationDefault, ...locationBL]
}
