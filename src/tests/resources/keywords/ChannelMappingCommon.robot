***Variables***
${eTrusted_channel_selector_button}        app=button#select_channelSelectionForm_  #append shop channel id
${eTrusted_channel_selector_list_item}     app=li#select_channel_                   #append etrusted channel id
${eTrusted_channel_deselect_list_item}     app=li#select_widgetLocation_deselect
${mapped_channel}                          app=#selectValue_channelSelectionForm_   #append shop channel id

***Keywords***
Wait Until Channel Is Mapped
    [Arguments]  ${shop_channel_id}  ${expected_etrusted_channel_name}
    Wait Until Keyword Succeeds    5x  1 sec  Channel Is Mapped  ${shop_channel_id}  ${expected_etrusted_channel_name}

Channel Is Mapped
    [Arguments]  ${shop_channel_id}  ${expected_etrusted_channel_name}
    ${actual_mapped_channel_name}  Get Text    ${mapped_channel}${shop_channel_id}
    Should Be Equal As Strings     ${expected_etrusted_channel_name}        ${actual_mapped_channel_name}

Channel Is Unmapped
    [Arguments]  ${shop_channel_id}
    Channel Is Mapped   ${shop_channel_id}      Select

Map A Channel
    [Arguments]     ${shop_channel_id}  ${etrusted_channel_id}
    Click Button    ${eTrusted_channel_selector_button}${shop_channel_id}
    Click Element   ${eTrusted_channel_selector_list_item}${etrusted_channel_id}

Unmap A Channel
    [Arguments]     ${shop_channel_id}
    Click Button    ${eTrusted_channel_selector_button}${shop_channel_id}
    Click Element   ${eTrusted_channel_deselect_list_item}