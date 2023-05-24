import { IWidgetLocation } from './types'

export enum TypeReview {
  service = 'Service reviews',
  product = 'Product reviews',
}

export const WIDGET_LOCATIONS: IWidgetLocation[] = [
  {
    id: 'wdg-loc-hp',
    name: 'Home Page',
    key: 'application_widgets_position_homepage',
    availableForType: [TypeReview.service],
  },
  {
    id: 'wdg-loc-pp',
    name: 'Product Page',
    key: 'application_widgets_position_productpage',
    availableForType: [TypeReview.service, TypeReview.product],
  },
  {
    id: 'wdg-loc-pl',
    name: 'Product Listings',
    key: 'application_widgets_position_productlistings',
    availableForType: [TypeReview.service, TypeReview.product],
  },
  {
    id: 'wdg-loc-lrm',
    name: 'Left/Right margin',
    key: 'application_widgets_position_leftRightMargin',
    availableForType: [TypeReview.service],
  },
  {
    id: 'wdg-loc-pd',
    name: 'Product Description',
    key: 'application_widgets_position_productdescription',
    availableForType: [TypeReview.service, TypeReview.product],
  },
  {
    id: 'wdg-loc-hd',
    name: 'Page Header',
    key: 'application_widgets_position_header',
    availableForType: [TypeReview.service],
  },
  {
    id: 'wdg-loc-ft',
    name: 'Page Footer',
    key: 'application_widgets_position_footer',
    availableForType: [TypeReview.service],
  },

  {
    id: 'wdg-loc-pn',
    name: 'Product Name',
    key: 'application_widgets_position_productname',
    availableForType: [TypeReview.service, TypeReview.product],
  },
  {
    id: 'wdg-loc-cst',
    name: 'Custom',
    key: 'application_widgets_position_custom',
    availableForType: [TypeReview.service, TypeReview.product],
  },
]
