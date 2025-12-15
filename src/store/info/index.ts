import { GetState, SetState } from 'zustand'
import { AppStore } from '../useStore'
import { InfoState, InfoStore, IUserInfo } from './types'

const initialState: InfoState = {
  language: 'en-GB',
  infoOfSystem: {} as IUserInfo,
}

const IS_VITE_DEACTIVATE_ALLOWS_EVENTS_BY_ORDER_STATUS = Boolean(
  Number(process.env.VITE_DEACTIVATE_ALLOWS_EVENTS_BY_ORDER_STATUS)
)

export const infoStore = (set: SetState<AppStore>, get: GetState<AppStore>): InfoStore => ({
  infoState: initialState,
  setLanguage: (language: string) => {
    get()
    set(store => ({ infoState: { ...store.infoState, language } }))
  },

  getInfoOfSystem: (info: IUserInfo) => {
    const allowsEventsByOrderStatus = IS_VITE_DEACTIVATE_ALLOWS_EVENTS_BY_ORDER_STATUS
      ? false
      : info.allowsEventsByOrderStatus

    const isHasPropertySendReviewInvitesForProduct = Object.prototype.hasOwnProperty.call(
      info,
      'allowsSendReviewInvitesForProduct'
    )
    const isHasPropertyAllowsEditIntegrationCode = Object.prototype.hasOwnProperty.call(
      info,
      'allowsEditIntegrationCode'
    )
    const isHasPropertyAllowsSupportWidgets = Object.prototype.hasOwnProperty.call(
      info,
      'allowsSupportWidgets'
    )

    const isHasPropertyAllowsTrustedCheckoutWidget = Object.prototype.hasOwnProperty.call(
      info,
      'allowsTrustedCheckoutWidget'
    )

    info = Object.prototype.hasOwnProperty.call(info, 'allowsSendReviewInvitesForPreviousOrders')
      ? {
          ...info,
          allowsEventsByOrderStatus,
          ...(!isHasPropertySendReviewInvitesForProduct && {
            allowsSendReviewInvitesForProduct: true,
          }),
          ...(!isHasPropertyAllowsEditIntegrationCode && {
            allowsEditIntegrationCode: true,
          }),
          ...(!isHasPropertyAllowsSupportWidgets && {
            allowsSupportWidgets: true,
          }),
          ...(!isHasPropertyAllowsTrustedCheckoutWidget && {
            allowsTrustedCheckoutWidget: false,
          }),
        }
      : {
          ...info,
          allowsSendReviewInvitesForPreviousOrders: true,
          allowsEventsByOrderStatus,
          ...(!isHasPropertySendReviewInvitesForProduct && {
            allowsSendReviewInvitesForProduct: true,
          }),
          ...(!isHasPropertyAllowsEditIntegrationCode && {
            allowsEditIntegrationCode: true,
          }),
          ...(!isHasPropertyAllowsSupportWidgets && {
            allowsSupportWidgets: true,
          }),
          ...(!isHasPropertyAllowsTrustedCheckoutWidget && {
            allowsTrustedCheckoutWidget: false,
          }),
        }

    set(store => ({ infoState: { ...store.infoState, infoOfSystem: info } }))
  },
})
