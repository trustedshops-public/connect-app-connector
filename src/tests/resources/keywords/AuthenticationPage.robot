*** Settings ***
Library             SeleniumLibrary
Library             PageObjectLibrary
Resource            Common.robot

*** Variables ***
${client_id_input}          app=input#input_clientId
${client_secret_input}      app=input#input_clientSecret
${connect_button}           app=button#button_credentialsSubmit
${authentication_error}     app=.ts-text-error

*** Keywords ***
Authentication Page Is Loaded
    Wait Until Keyword Succeeds     10 s   1 s   Authentication URL Is Correct
    Wait Until Page Contains Element    ${client_id_input}      timeout=30 s
    Wait Until Element Is Visible   ${client_id_input}      timeout=30 s

Authentication URL Is Correct
    ${current_url}          Get Location
    Should Contain          ${current_url}  /ts/authentication

Submit Authentication Details
    [Arguments]     ${client_id}   ${client_secret}

    Authentication Page Is Loaded
    Input Text                      ${client_id_input}      ${client_id}
    Input Text                      ${client_secret_input}  ${client_secret}
    Click Button                    ${connect_button}

Authentication Error Is Shown
    Wait Until Element Is Visible   ${authentication_error}
