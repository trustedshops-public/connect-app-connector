*** Settings ***
Library     SeleniumLibrary
Resource    ../resources/keywords/AuthenticationPage.robot
Resource    ../resources/config.robot

Suite Setup     Run Application
Suite Teardown  End Application Run

*** Test Cases ***
User can authenticate
    When Submit Authentication Details    ${default_account.client_id}   ${default_account.client_secret}
    Then Application Is Loaded
    And Save Message Appears
    
Authentication fails with invalid client id
    When Submit Authentication Details    invalid    ${default_account.client_secret}
    Then Authentication Error Is Shown

Authentication fails with invalid client secret
    When Submit Authentication Details    ${default_account.client_id}    invalid
    Then Authentication Error Is Shown

User authentication persists
    Given Log In As ${default_account}
    When Reload Page
    Application Is Loaded
    