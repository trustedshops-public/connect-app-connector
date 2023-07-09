import { ITrustbadge } from '@/baseLayers/types'

const baseSrcUrl =
  process.env.VITE_NODE_ENV === 'development'
    ? 'widgets-qa.trustedshops.com'
    : 'widgets.trustedshops.com'

export const getTrustbadgeDefault = (id: string): ITrustbadge => {
  return {
    id,
    children: [
      {
        tag: 'script',
        attributes: {
          async: {
            attributeName: 'async',
          },
          'data-desktop-y-offset': {
            value: 0,
            attributeName: 'data-desktop-y-offset',
          },
          'data-mobile-y-offset': {
            value: 0,
            attributeName: 'data-mobile-y-offset',
          },
          'data-desktop-disable-reviews': {
            value: false,
            attributeName: 'data-desktop-disable-reviews',
          },
          'data-desktop-enable-custom': {
            value: false,
            attributeName: 'data-desktop-enable-custom',
          },
          'data-desktop-position': {
            value: 'right',
            attributeName: 'data-desktop-position',
          },
          'data-desktop-custom-width': {
            value: 156,
            attributeName: 'data-desktop-custom-width',
          },
          'data-desktop-enable-fadeout': {
            value: false,
            attributeName: 'data-desktop-enable-fadeout',
          },
          'data-disable-mobile': {
            value: false,
            attributeName: 'data-disable-mobile',
          },
          'data-disable-trustbadge': {
            value: false,
            attributeName: 'data-disable-trustbadge',
          },
          'data-mobile-custom-width': {
            value: 156,
            attributeName: 'data-mobile-custom-width',
          },
          'data-mobile-disable-reviews': {
            value: false,
            attributeName: 'data-mobile-disable-reviews',
          },
          'data-mobile-enable-custom': {
            value: false,
            attributeName: 'data-mobile-enable-custom',
          },
          'data-mobile-position': {
            value: 'right',
            attributeName: 'data-mobile-position',
          },
          'data-color-scheme': {
            value: `os-default`,
            attributeName: 'data-color-scheme',
          },
          charset: {
            value: 'UTF-8',
            attributeName: 'charset',
          },
          src: {
            value: `//${baseSrcUrl}/js/${id}.js`,
            attributeName: 'src',
          },
        },
      },
    ],
  }
}
