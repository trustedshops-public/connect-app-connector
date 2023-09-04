import {
  AUTH_KEYS,
  CHANNEL_KEYS,
  DASHBOADR_KEYS,
  GLOBAL_KEYS,
  INVITES_KEYS,
  ITRUSTBADGE_KEYS,
  IWIDGETS_KEYS,
  ROUTES_KEYS,
  SETTINGS_KEYS,
} from './types'

export const PHRASES_GLOBAL_KEYS: GLOBAL_KEYS = {
  global_copyright_text: 'global.copyright.text',
  global_copyright_url_1: 'global.copyright.url_1',
  global_help_title: 'global.help.title',
  global_help_text: 'global.help.text',
  global_help_link_text: 'global.help.link.text',
  global_help_link_url_1: 'global.help.link.url_1',
  global_help_link_shopify: 'global.help.link.shopify',
  global_help_link_shopware5: 'global.help.link.shopware5',
  global_help_link_shopware6: 'global.help.link.shopware6',
  global_button_submit: 'global.button.submit',
  global_button_cancel: 'global.button.cancel',
  global_slider_active: 'global.slider.active',
  global_slider_inactive: 'global.slider.inactive',
  global_notification_error_save: 'global.notification.error.save',
  global_notification_error_exportTimeout: 'global.notification.error.exportTimeout',
  global_notification_error_productIdUnselected: 'global.notification.error.productIdUnselected',
  global_notification_success_save: 'global.notification.success.save',
  global_notification_cacheclear_save: 'global.notification.cacheclear.save',
  global_placeholder_channel: 'global.placeholder.channel',
  global_placeholder_location: 'global.placeholder.location',
  global_placeholder_productid: 'global.placeholder.productid',
}

export const PHRASES_AUTH_KEYS: AUTH_KEYS = {
  authentication_salesLink_text: 'authentication.salesLink.text',
  authentication_salesLink_url_1: 'authentication.salesLink.url_1',
  authentication_title: 'authentication.title',
  authentication_credentials_help_title: 'authentication.credentials.help.title',
  authentication_credentials_help_text: 'authentication.credentials.help.text',
  authentication_credentials_help_button_text: 'authentication.credentials.help.button.text',
  authentication_credentials_help_button_url: 'authentication.credentials.help.button.url',
  authentication_credentials_connect_title: 'authentication.credentials.connect.title',
  authentication_client: 'authentication.client',
  authentication_secret: 'authentication.secret',
  authentication_error: 'authentication.error',
  authentication_button_submit: 'authentication.button.submit',
  authentication_supporthelp_text: 'authentication.supporthelp.text',
  authentication_supporthelp_url_1: 'authentication.supporthelp.url_1',
  ...PHRASES_GLOBAL_KEYS,
}

const PHRASES_TRUSTBADGE_KEYS: ITRUSTBADGE_KEYS = {
  application_trustbadge_integrationmode: 'application.trustbadge.integrationmode',
  application_trustbadge_radioButton_standard: 'application.trustbadge.radioButton.standard',
  application_trustbadge_radioButton_expert: 'application.trustbadge.radioButton.expert',
  application_trustbadge_titel: 'application.trustbadge.titel',
  application_trustbadge_subtitel: 'application.trustbadge.subtitel',
  application_trustbadge_description: 'application.trustbadge.description',
  application_trustbadge_placement_desktop: 'application.trustbadge.placement.desktop',
  application_trustbadge_placement_inputDescription:
    'application.trustbadge.placement.inputDescription',
  application_trustbadge_placement_pixels: 'application.trustbadge.placement.pixels',
  application_trustbadge_placement_mobile: 'application.trustbadge.placement.mobile',
  application_trustbadge_placement_center: 'application.trustbadge.placement.center',
  application_trustbadge_placement_left: 'application.trustbadge.placement.left',
  application_trustbadge_placement_right: 'application.trustbadge.placement.right',
  application_trustbadge_expert_help_text: 'application.trustbadge.expert.help.text',
  application_trustbadge_expert_help_url_1: 'application.trustbadge.expert.help.url_1',
  application_trustbadge_popup_submit: 'application.trustbadge.popup.submit',
  application_trustbadge_popup_titel: 'application.trustbadge.popup.titel',
  application_trustbadge_popup_text: 'application.trustbadge.popup.text',
}

export const PHRASES_WIDGETS_KEYS: IWIDGETS_KEYS = {
  application_widgets_title: 'application.widgets.title',
  application_widgets_description: 'application.widgets.description',
  application_widgets_table_title: 'application.widgets.table.title',
  application_widgets_table_header_1: 'application.widgets.table.header.1',
  application_widgets_table_header_2: 'application.widgets.table.header.2',
  application_widgets_table_header_3: 'application.widgets.table.header.3',
  application_widgets_table_header_4: 'application.widgets.table.header.4',
  application_widgets_noWidgets: 'application.widgets.noWidgets',
  application_widgets_create: 'application.widgets.create',
  application_widgets_reload: 'application.widgets.reload',
  application_widgets_configuration: 'application.widgets.configuration',
  application_widgets_productID: 'application.widgets.productID',
  application_widgets_status_integrated: 'application.widgets.status.integrated',
  application_widgets_status_notIntegrated: 'application.widgets.status.notIntegrated',
  application_widgets_extension_title: 'application.widgets.extension.title',
  application_widgets_extension_description: 'application.widgets.extension.description',
  application_widgets_popup_submit_url_1: 'application.widgets.popup.submit.url_1',
  application_widgets_popup_submit_text: 'application.widgets.popup.submit.text',
  application_widgets_popup_title: 'application.widgets.popup.title',
  application_widgets_popup_text: 'application.widgets.popup.text',
  application_widgets_position_homepage: 'application.widgets.position.homepage',
  application_widgets_position_productpage: 'application.widgets.position.productpage',
  application_widgets_position_leftRightMargin: 'application.widgets.position.leftRightMargin',
  application_widgets_position_productlistings: 'application.widgets.position.productlistings',
  application_widgets_position_header: 'application.widgets.position.header',
  application_widgets_position_footer: 'application.widgets.position.footer',
  application_widgets_position_custom: 'application.widgets.position.custom',
  application_widgets_position_productname: 'application.widgets.position.productname',
  application_widgets_position_productdescription:
    'application.widgets.position.productdescription',
  application_widgets_name_MiniStars: 'application.widgets.name.MiniStars',
  application_widgets_name_FullReviewList: 'application.widgets.name.FullReviewList',
  application_widgets_name_ReviewCarousel: 'application.widgets.name.ReviewCarousel',
  application_widgets_name_TrustedStars: 'application.widgets.name.TrustedStars',
  application_widgets_name_CustomerVoice: 'application.widgets.name.customervoice',
  application_widgets_contentType_productReviews: 'application.widgets.contentType.productReviews',
  application_widgets_contentType_serviceReviews: 'application.widgets.contentType.serviceReviews',
}

export const PHRASES_INVITES_KEYS: INVITES_KEYS = {
  application_invites_product_title: 'application.invites.product.title',
  application_invites_product_description_url_1: 'application.invites.product.description.url_1',
  application_invites_product_description_text: 'application.invites.product.description.text',
  application_invites_product_help_text: 'application.invites.product.help.text',
  application_invites_product_help_url_1: 'application.invites.product.help.url_1',
  application_invites_send_title: 'application.invites.send.title',
  application_invites_send_description: 'application.invites.send.description',
  application_invites_send_descriptionIntro: 'application.invites.send.descriptionIntro',
  application_invites_send_radioButton_standard_text:
    'application.invites.send.radioButton.standard.text',
  application_invites_send_radioButton_standard_note_text:
    'application.invites.send.radioButton.standard.note.text',
  application_invites_send_radioButton_deliverydate_text:
    'application.invites.send.radioButton.deliverydate.text',
  application_invites_send_radioButton_deliverydate_note_text:
    'application.invites.send.radioButton.deliverydate.note.text',
  application_invites_send_radioButton_orderstatus_text:
    'application.invites.send.radioButton.orderstatus.text',
  application_invites_send_radioButton_orderstatus_note_text:
    'application.invites.send.radioButton.orderstatus.note.text',
  application_invites_send_radioButton_orderstatus_note_check_text:
    'application.invites.send.radioButton.orderstatus.note.check.text',
  application_invites_send_radioButton_orderstatus_warning_text:
    'application.invites.send.radioButton.orderstatus.warning.text',
  application_invites_send_radioButton_orderstatus_warning_url_1:
    'application.invites.send.radioButton.orderstatus.warning.url_1',
  application_invites_send_radioButton_orderstatus_warning_url_2:
    'application.invites.send.radioButton.orderstatus.warning.url_2',

  application_invites_send_radioButton_use_text: 'application.invites.send.radioButton.use.text',
  application_invites_send_radioButton_use_note_url_1:
    'application.invites.send.radioButton.use.note.url_1',
  application_invites_send_radioButton_use_note_text:
    'application.invites.send.radioButton.use.note.text',
  application_invites_send_radioButton_notUse_text:
    'application.invites.send.radioButton.notUse.text',
  application_invites_send_radioButton_notUse_note_url_1:
    'application.invites.send.radioButton.notUse.note.url_1',
  application_invites_send_radioButton_notUse_note_text:
    'application.invites.send.radioButton.notUse.note.text',
  application_invites_send_help_url_1: 'application.invites.send.help.url_1',
  application_invites_send_help_text: 'application.invites.send.help.text',
  application_invites_send_export_title: 'application.invites.send.export.title',
  application_invites_send_export_description: 'application.invites.send.export.description',
  application_invites_send_export_step_1_title: 'application.invites.send.export.step.1.title',
  application_invites_send_export_step_1_option: 'application.invites.send.export.step.1.option',
  application_invites_send_export_button: 'application.invites.send.export.button',
  application_invites_send_export_step_2_title: 'application.invites.send.export.step.2.title',
  application_invites_send_export_step_2_description_text:
    'application.invites.send.export.step.2.description.text',
  application_invites_send_export_step_2_description_url_1:
    'application.invites.send.export.step.2.description.url_1',
  application_invites_send_export_step_2_description_url_2:
    'application.invites.send.export.step.2.description.url_2',
  application_invites_send_export_help_url_1: 'application.invites.send.export.help.url_1',
  application_invites_send_export_help_text: 'application.invites.send.export.help.text',
  application_invites_sendbyos_title: 'application.invites.sendbyos.title',
  application_invites_sendbyos_description: 'application.invites.sendbyos.description',
  application_invites_sendbyos_information: 'application.invites.sendbyos.information',
  application_invites_sendbyos_type_serviceReviews:
    'application.invites.sendbyos.type.serviceReviews',
  application_invites_sendbyos_type_productReviews:
    'application.invites.sendbyos.type.productReviews',
  application_invites_sendbyos_upgradedescription_text:
    'application.invites.sendbyos.upgradedescription.text',
  application_invites_sendbyos_upgradedescription_url_1:
    'application.invites.sendbyos.upgradedescription.url_1',
  application_invites_sendbyos_orderstatus_warning_text:
    'application.invites.sendbyos.orderstatus.warning.text',
  application_invites_sendbyos_orderstatus_warning_url_1:
    'application.invites.sendbyos.orderstatus.warning.url_1',
  application_invites_sendbyos_orderstatus_warning_url_2:
    'application.invites.sendbyos.orderstatus.warning.url_2',
  application_invites_sendbyos_success_delay_text:
    'application.invites.sendbyos.success.delay.text',
  application_invites_sendbyos_success_delay_url_1:
    'application.invites.sendbyos.success.delay.url_1',
  application_invites_sendbyos_export_productdata:
    'application.invites.sendbyos.export.productdata',
}

export const PHRASES_SETTINGS_KEYS: SETTINGS_KEYS = {
  application_settings_title: 'application.settings.title',
  application_settings_description: 'application.settings.description',
  application_settings_channel_title: 'application.settings.channel.title',
  application_settings_channel_description: 'application.settings.channel.description',
  application_settings_channel_caution: 'application.settings.channel.caution',
  application_settings_disconnect_title: 'application.settings.disconnect.title',
  application_settings_disconnect_description: 'application.settings.disconnect.description',
  application_settings_disconnect_button: 'application.settings.disconnect.button',
  application_settings_disconnect_help_url_1: 'application.settings.disconnect.help.url_1',
  application_settings_disconnect_help_text: 'application.settings.disconnect.help.text',
  application_settings_popup_text: 'application.settings.popup.text',
  application_settings_popup_submit: 'application.settings.popup.submit',
  application_settings_popup_titel: 'application.settings.popup.titel',
}

const PHRASES_CHANNEL_KEYS: CHANNEL_KEYS = {
  channelSelect_submit: 'channelSelect.submit',
  channelSelect_titel: 'channelSelect.titel',
  channelSelect_info: 'channelSelect.info',
  channelSelect_title_shopsystem: 'channelSelect.title.shopsystem',
  channelSelect_title_etrusted: 'channelSelect.title.etrusted',
}

const PHRASES_ROUTES_KEYS: ROUTES_KEYS = {
  application_routes_trustbadge: 'application.routes.trustbadge',
  application_routes_widgets: 'application.routes.widgets',
  application_routes_invites: 'application.routes.invites',
  application_routes_settings: 'application.routes.settings',
  application_routes_channelSelector: 'application.routes.channelSelector',
}

export const PHRASES_DASHBOARD_KEYS: DASHBOADR_KEYS = {
  ...PHRASES_TRUSTBADGE_KEYS,
  ...PHRASES_WIDGETS_KEYS,
  ...PHRASES_INVITES_KEYS,
  ...PHRASES_SETTINGS_KEYS,
  ...PHRASES_CHANNEL_KEYS,
  ...PHRASES_ROUTES_KEYS,
  ...PHRASES_GLOBAL_KEYS,
}
