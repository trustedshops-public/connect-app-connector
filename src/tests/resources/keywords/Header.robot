***Settings***
Resource    InvitesTab.robot
Resource    WidgetsTab.robot
Resource    SettingsTab.robot

*** Variables ***
${selected_channel}     app=#selectValue_channelSelection

${invites_menu_item}    app=#tab_2
${settings_menu_item}   app=#tab_3
${widgets_menu_item}    app=#tab_1

${status_message}       app=#status_popup
        # 'shadow': 'app=.ts-opacity-50',
        
        # 'disabled_selected_channel': 'app=#selectValue_channelSelection.cursor-not-allowed' 

*** Keywords ***
Open Invites Tab
    Wait Until Keyword Succeeds     10 sec   1 sec   Click Element   ${invites_menu_item}
    Invites Tab Is Loaded

Open Widgets Tab
    Wait Until Keyword Succeeds     10 sec   1 sec   Click Element   ${widgets_menu_item}
    Widgets Tab Is Loaded

Open Settings Tab
    Wait Until Keyword Succeeds     10 sec   1 sec   Click Element   ${settings_menu_item}
    Settings Tab Is Loaded

Wait Until Message Disappears
    Wait Until Element Is Not Visible   ${status_message}   20 sec

Save Message Appears
    Wait Until Element Is Visible   ${status_message}
    ${status}   Get Text    ${status_message}
    Should Be Equal As Strings  ${status}   Changes saved successfully
    # TO DO - Get value from file
        # with open ('./src/locales/resources/en-GB.json', 'r') as file:
        #     en_gb_messages = json.loads(file.read())
        #     expected_message = en_gb_messages['global']['successMessages']['Save']

Error Appears
    [Arguments]     ${error_text}
    Wait Until Element Is Visible   ${status_message}
    ${status}   Get Text    ${status_message}
    Should Be Equal As Strings  ${status}   ${error_text}
