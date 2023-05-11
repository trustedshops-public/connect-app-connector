*** Settings ***
Library                 SeleniumLibrary
Library                 PageObjectLibrary
Library                 OperatingSystem
Library                 Process
Resource                ../config.robot
Resource                Header.robot
Resource                AuthenticationPage.robot
Resource                ChannelMappingCommon.robot

*** Variables ***
${connect_app_shadow_host_locator}  \#shadowRoot
${loading_icon}                     app=.ts-animate-spinner
${command}                          npm run dev:test

*** Keywords ***
Setup
    Add Location Strategy       app  Connect App Locator Strategy    persist=True

Run Application
    [Arguments]     ${base_layer_channels}=${NULL}  ${mapped_channels}=${NULL}  ${mapped_widgets}=${NULL}
    [Documentation]  The arguments passed in should match the identifiers for test data defined in src/baseLayers/testData

    ${arguments}    Set Variable If   '${base_layer_channels}' != '${NULL}'    salesChannel=${base_layer_channels}              ${SPACE}
    ${arguments}    Set Variable If   '${mapped_channels}' != '${NULL}'        ${arguments} mappedChannels=${mapped_channels}   ${arguments}
    ${arguments}    Set Variable If   '${mapped_widgets}' != '${NULL}'         ${arguments} widgets=${mapped_widgets}           ${arguments}

    Start Application In Shell     ${arguments}
    ${app_running}  Run Keyword And Return Status   Open Application In Browser

    # Retry once if app failed to load
    IF  not ${app_running}
        End Application Run
        Start Application In Shell     ${arguments}
        Open Application In Browser
    END

Start Application In Shell
    [Documentation]  Triggers the process to start a localhost version of the application
    [Arguments]     ${arguments}

    ${process}        Start Process    ${arguments} ${command}         shell=yes
    ${result}         Run Process        ./src/tests/resources/scripts/isAppRunning.sh
    IF  'rc 0' not in '${result}'
        Fail  App failed to start
    ELSE
        Set Global Variable         ${process}
    END

Open Application In Browser
    Open Browser    ${url}   ${browser}
    Setup Selenium  
    Wait Until Page Contains Element   css=${connect_app_shadow_host_locator}
    Authentication Page Is Loaded

End Application Run
    Terminate Process   ${process}
    Close Browser
 
Setup Selenium  
    Set Selenium Timeout        10 seconds
    Set Window Size             1800     1200

Connect App Locator Strategy
    [Arguments]     ${browser}  ${locator}  ${tag}  ${constraints}
    
    ${elements}     Execute Javascript      return document.querySelector("${connect_app_shadow_host_locator}").shadowRoot.querySelectorAll("${locator}")
    [Return]        ${elements}

Application Is Loaded
    Wait Until Element Is Visible   ${selected_channel}

Application Is Enabled
    Channel Mapping Popup Is Not Displayed
    Wait Until Element Does Not Contain  ${selected_channel}  Choose an option
    Wait Until Page Does Not Contain Element    ${loading_icon}

Log in as ${account}
    Submit Authentication Details  ${account.client_id}  ${account.client_secret}
    Application Is Loaded
    Save Message Appears
    Wait Until Message Disappears
