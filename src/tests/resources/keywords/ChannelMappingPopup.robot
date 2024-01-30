*** Settings ***
Resource    Header.robot

*** Variables ***
${eTrusted_channel_selector_button}        app=button#select_channelSelectionForm_  #append shop channel id
${eTrusted_channel_selector_list_item}     app=li#select_channel_                   #append etrusted channel id
${save_mapping_popup_button}               app=#button_saveChannelsModal

*** Keywords ***
Channel Mapping Popup Is Displayed
    Wait Until Element Is Visible   ${save_mapping_popup_button} 

Channel Mapping Popup Is Not Displayed
    Wait Until Page Does Not Contain Element    ${save_mapping_popup_button}

Save Channel Mapping In Popup
    Click Button    ${save_mapping_popup_button}
    Save Message Appears