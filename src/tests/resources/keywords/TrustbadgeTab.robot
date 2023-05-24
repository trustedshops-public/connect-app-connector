***Variables***
${tb_toggle}            app=#switch_button_trustBadge
${deactivate_confirm}   app=#button_submitDiactivateTB
${edit_code_radio}      app=input + div#expert
${tb_code_text}         app=textarea
${disabled_radio}       app=.ts-cursor-not-allowed

***Keywords***
Trustbadge Is Activated
    ${activated}    Run Keyword And Return Status   Radio Buttons Are Enabled
    [Return]        ${activated}

Activate Trustbadge
    ${activated}    Trustbadge Is Activated
    IF  not ${activated}
        Wait Until Keyword Succeeds     10 sec  1 sec  Toggle Trustbadge
    END
    # Doesn't show the 'successful save' dialog? Not sure if this is a bug

Deactivate Trustbadge
    ${activated}    Trustbadge Is Activated
    IF   ${activated}
        Toggle Trustbadge
        Click Button    ${deactivate_confirm}
        Save Message Appears
    END

Toggle Trustbadge
    Click Element   ${tb_toggle}

Radio Buttons Are Enabled
    Wait Until Page Does Not Contain Element    ${disabled_radio}

Radio Buttons Are Disabled
    Wait Until Page Contains Element    ${disabled_radio}

View Embed Code
    Click Element                   ${edit_code_radio}
    Wait Until Element Is Visible   ${tb_code_text}

Embed Code Contains
    [Arguments]     ${text}
    ${tb_code}      Get Element Attribute       ${tb_code_text}     value
    Should Contain  ${tb_code}      ${text}     ignore_case=${true}
