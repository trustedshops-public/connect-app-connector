***Settings***
Resource    Header.robot

***Variables***
${mapped_channel}                   app=#selectValue_channelSelectionForm_  #append shop channel id
${save_mapping_settings_button}     app=#button_settingsSaveChannels
${disconnect_button}                app=#button_settingsDisconnectOpenModal
${disconnect_confirm_button}        app=#button_settingsDisconnect

***Keywords***
Settings Tab Is Loaded
    Wait Until Element Is Visible   ${disconnect_button}
    
Disconnect
    Click Button    ${disconnect_button}
    Wait Until Element Is Visible   ${disconnect_confirm_button}
    Click Button    ${disconnect_confirm_button}

Save Channel Mapping In Settings
    Click Button    ${save_mapping_settings_button}
    Save Message Appears
