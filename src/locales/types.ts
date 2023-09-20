export interface IPhraseAuth {
  button: {
    submit: string
  }
  client: string
  credentials: {
    connect: {
      title: string
    }
    help: {
      button: {
        text: string
        url: string
      }
      text: string
      title: string
    }
  }
  error: string
  salesLink: {
    text: string
    url_1: string
  }
  secret: string
  title: string

  supporthelp: {
    text: '[%s]Need help with creating the Client ID and Client Secret?[%s]'
    url_1: 'mailto:members@trustedshops.com'
  }
}

export interface IInvites {
  product: {
    title: string
    help: {
      text: string
      url_1: string
    }
    description: {
      text: string
      url_1: string
    }
  }
  sendbyos: {
    title: string
    description: string
    information: string
    type: {
      serviceReviews: string
      productReviews: string
    }
    upgradedescription: {
      text: string
      url_1: string
    }
    orderstatus: {
      warning: {
        text: string
        url_1: string
        url_2: string
      }
    }
    success: {
      delay: {
        text: string
        url_1: string
      }
    }
    export: {
      productdata: string
    }
  }
  send: {
    title: string
    description: string
    help: {
      text: string
      url_1: string
    }
    export: {
      title: string
      button: string
      description: string
      step: {
        1: {
          title: string
          option: string
        }
        2: {
          description: {
            url_1: string
            url_2: string
            text: string
          }
          title: string
        }
      }
      help: {
        text: string
        url_1: string
      }
    }
    radioButton: {
      notUse: {
        note: {
          text: string
          url_1: string
        }
        text: string
      }
      use: {
        note: {
          text: string
          url_1: string
        }
        text: string
      }
    }
  }
}
export interface IPhraseGlobal {
  button: {
    cancel: string
    submit: string
    save: string
  }
  copyright: {
    text: string
    url_1: string
  }
  help: {
    link: {
      shopify: string
      shopware5: string
      shopware6: string
      text: string
    }
    text: string
    title: string
  }
  slider: {
    active: string
    inactive: string
  }
  errorMessages: {
    SaveError: string
  }
  successMessages: {
    Save: string
  }
  placeholder: {
    channel: string
    location: string
    productid: string
  }
}

export interface IRoutes {
  authentication: string
  channelSelector: string

  invites: string
  settings: string
  trustbadge: string
  widgets: string
}

export interface ITrustbadge {
  description: string
  expert: {
    help: {
      text: string
      url_1: string
    }
  }
  placement: {
    desktop: string
    inputDescription: string
    mobile: string
    pixels: string
  }
  popup: {
    submit: string
    cancel?: string
    text: string
    titel: string
  }
  radioButton: {
    expert: string
    standard: string
  }
  subtitel: string
  titel: string
}

export interface IWidgets {
  configuration: string
  create: string
  description: string
  noWidgets?: string
  extension: {
    description: string
    title: string
  }
  popup: {
    submit: string
    text: string
    title: string
  }
  productID: string
  status: {
    integrated: string
    notIntegrated: string
  }
  table: {
    header: {
      '1': string
      '2': string
      '3': string
      '4': string
    }
    title: string
  }
  title: string
}

interface ISettings {
  title: string
  channel: {
    description: string
    title: string
  }
  description: string
  disconnect: {
    button: string
    description: string
    help: {
      text: string
      url_1: string
    }
    title: string
  }
}

export interface IResourses {
  application: {
    routes: IRoutes
    invites: IInvites
    trustbadge: ITrustbadge
    widgets: IWidgets
    settings: ISettings
  }
  channelSelect: {
    submit: string
    titel: string
    info: string
    title: {
      etrusted: string
      shopsystem: string
    }
  }
  authentication: IPhraseAuth
  global: IPhraseGlobal
}

export type GLOBAL_KEYS = {
  global_copyright_text: string
  global_copyright_url_1: string
  global_help_title: string
  global_help_text: string
  global_help_link_text: string
  global_help_link_url_1: string
  global_help_link_shopify: string
  global_help_link_shopware5: string
  global_help_link_shopware6: string
  global_button_submit: string
  global_button_cancel: string
  global_button_save: string
  global_slider_active: string
  global_slider_inactive: string
  global_placeholder_channel: string
  global_placeholder_location: string
  global_placeholder_productid: string
  global_notification_error_save: string
  global_notification_error_exportTimeout: string
  global_notification_error_productIdUnselected: string
  global_notification_success_save: string
  global_notification_cacheclear_save: string
}

export type AUTH_KEYS = {
  authentication_salesLink_text: string
  authentication_salesLink_url_1: string
  authentication_title: string
  authentication_credentials_help_title: string
  authentication_credentials_help_text: string
  authentication_credentials_help_button_text: string
  authentication_credentials_help_button_url: string
  authentication_credentials_connect_title: string
  authentication_client: string
  authentication_secret: string
  authentication_error: string
  authentication_button_submit: string
  authentication_supporthelp_text: string
  authentication_supporthelp_url_1: string
} & GLOBAL_KEYS

export type ITRUSTBADGE_KEYS = {
  application_trustbadge_integrationmode: string
  application_trustbadge_radioButton_standard: string
  application_trustbadge_radioButton_expert: string
  application_trustbadge_titel: string
  application_trustbadge_subtitel: string
  application_trustbadge_description: string
  application_trustbadge_placement_desktop: string
  application_trustbadge_placement_inputDescription: string
  application_trustbadge_placement_pixels: string
  application_trustbadge_placement_mobile: string
  application_trustbadge_placement_center: string
  application_trustbadge_placement_left: string
  application_trustbadge_placement_right: string
  application_trustbadge_expert_help_text: string
  application_trustbadge_expert_help_url_1: string
  application_trustbadge_popup_submit: string
  application_trustbadge_popup_titel: string
  application_trustbadge_popup_text: string
}

export type IWIDGETS_KEYS = {
  application_widgets_title: string
  application_widgets_description: string
  application_widgets_table_title: string
  application_widgets_table_header_1: string
  application_widgets_table_header_2: string
  application_widgets_table_header_3: string
  application_widgets_table_header_4: string
  application_widgets_noWidgets: string
  application_widgets_create: string
  application_widgets_reload: string
  application_widgets_configuration: string
  application_widgets_productID: string
  application_widgets_status_integrated: string
  application_widgets_status_notIntegrated: string
  application_widgets_extension_title: string
  application_widgets_extension_description: string
  application_widgets_popup_submit_url_1: string
  application_widgets_popup_submit_text: string
  application_widgets_popup_title: string
  application_widgets_popup_text: string
  application_widgets_position_homepage: string
  application_widgets_position_productpage: string
  application_widgets_position_leftRightMargin: string
  application_widgets_position_productdescription: string
  application_widgets_position_header: string
  application_widgets_position_footer: string
  application_widgets_position_productlistings: string
  application_widgets_position_productname: string
  application_widgets_position_custom: string
  application_widgets_name_MiniStars: string
  application_widgets_name_FullReviewList: string
  application_widgets_name_ReviewCarousel: string
  application_widgets_name_TrustedStars: string
  application_widgets_name_CustomerVoice: string
  application_widgets_contentType_productReviews: string
  application_widgets_contentType_serviceReviews: string
}

export type INVITES_KEYS = {
  application_invites_product_title: string
  application_invites_product_description_url_1: string
  application_invites_product_description_text: string
  application_invites_product_help_text: string
  application_invites_product_help_url_1: string
  application_invites_send_title: string
  application_invites_send_description: string
  application_invites_send_descriptionIntro: string
  application_invites_send_radioButton_standard_text: string
  application_invites_send_radioButton_standard_note_text: string
  application_invites_send_radioButton_deliverydate_text: string
  application_invites_send_radioButton_deliverydate_note_text: string
  application_invites_send_radioButton_orderstatus_text: string
  application_invites_send_radioButton_orderstatus_note_text: string
  application_invites_send_radioButton_orderstatus_note_check_text: string
  application_invites_send_radioButton_orderstatus_warning_text: string
  application_invites_send_radioButton_orderstatus_warning_url_1: string
  application_invites_send_radioButton_orderstatus_warning_url_2: string
  application_invites_send_radioButton_use_text: string
  application_invites_send_radioButton_use_note_url_1: string
  application_invites_send_radioButton_use_note_text: string
  application_invites_send_radioButton_notUse_text: string
  application_invites_send_radioButton_notUse_note_url_1: string
  application_invites_send_radioButton_notUse_note_text: string
  application_invites_send_help_url_1: string
  application_invites_send_help_text: string
  application_invites_send_export_title: string
  application_invites_send_export_description: string
  application_invites_send_export_step_1_title: string
  application_invites_send_export_step_1_option: string
  application_invites_send_export_button: string
  application_invites_send_export_step_2_title: string
  application_invites_send_export_step_2_description_text: string
  application_invites_send_export_step_2_description_url_1: string
  application_invites_send_export_step_2_description_url_2: string
  application_invites_send_export_help_url_1: string
  application_invites_send_export_help_text: string
  application_invites_sendbyos_title: string
  application_invites_sendbyos_description: string
  application_invites_sendbyos_information: string
  application_invites_sendbyos_type_serviceReviews: string
  application_invites_sendbyos_type_productReviews: string
  application_invites_sendbyos_upgradedescription_text: string
  application_invites_sendbyos_upgradedescription_url_1: string
  application_invites_sendbyos_orderstatus_warning_text: string
  application_invites_sendbyos_orderstatus_warning_url_1: string
  application_invites_sendbyos_orderstatus_warning_url_2: string
  application_invites_sendbyos_success_delay_text: string
  application_invites_sendbyos_success_delay_url_1: string
  application_invites_sendbyos_export_productdata: string
}

export type SETTINGS_KEYS = {
  application_settings_title: string
  application_settings_description: string
  application_settings_channel_title: string
  application_settings_channel_description: string
  application_settings_channel_caution: string
  application_settings_disconnect_title: string
  application_settings_disconnect_description: string
  application_settings_disconnect_button: string
  application_settings_disconnect_help_url_1: string
  application_settings_disconnect_help_text: string
  application_settings_popup_text: string
  application_settings_popup_submit: string
  application_settings_popup_titel: string
}

export type CHANNEL_KEYS = {
  channelSelect_submit: string
  channelSelect_titel: string
  channelSelect_info: string
  channelSelect_title_shopsystem: string
  channelSelect_title_etrusted: string
}

export type ROUTES_KEYS = {
  application_routes_trustbadge: string
  application_routes_widgets: string
  application_routes_invites: string
  application_routes_settings: string
  application_routes_channelSelector: string
}

export type DASHBOADR_KEYS = ROUTES_KEYS &
  CHANNEL_KEYS &
  SETTINGS_KEYS &
  INVITES_KEYS &
  IWIDGETS_KEYS &
  ITRUSTBADGE_KEYS &
  GLOBAL_KEYS
