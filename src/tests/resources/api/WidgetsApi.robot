*** Settings ***
Library         RequestsLibrary     # http://marketsquare.github.io/robotframework-requests/doc/RequestsLibrary.html
# Library         Collections
# Library         String
Resource        AuthenticationApi.robot
# Resource        ../config.robot

*** Variables ***
${api_internal_host}        https://widgets-api.integrations.etrusted.site
${widgets_path}             /v1/widgets?channelRef=

*** Keywords ***
Get List Of Widgets From Api
    [Documentation]         Updates the specified review with a new rating, comment & title.
    [Arguments]             ${username}     ${password}     ${channel_id}
    
    ${api_access_token} =   Get Bearer Token    ${username}     ${password} 
    Create Session          Widgets    ${api_internal_host}  verify=True
    ${headers} =            Create dictionary   Content-Type=application/json      Authorization=Bearer ${api_access_token}
    ${response} =           Get on session    Widgets      ${widgets_path}${channel_id}    headers=${headers}
    [Return]                ${response.json()['data']}