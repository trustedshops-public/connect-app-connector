*** Settings ***
Library         RequestsLibrary     # http://marketsquare.github.io/robotframework-requests/doc/RequestsLibrary.html
# Library         Collections
# Library         String

*** Variables ***
${api_login_host} =         https://login-qa.etrusted.com
${authenticate_path}        /auth/realms/business-QA/protocol/openid-connect/token

*** Keywords ***


Get Bearer Token
    [Documentation]     POSTs login to get a bearer token that is returned to be used in other API calls. 
    [Arguments]         ${username}     ${password}

    ${headers} =        Create dictionary   Content-Type=application/x-www-form-urlencoded
    ${body} =           Create dictionary   grant_type=password     client_id=mars-control-centre-client
    ...                 username=${username}   password=${password}
    Create Session      Authentication      ${api_login_host}       headers=${headers}      verify=True
    ${response} =       post on session     Authentication          ${authenticate_path}                 data=${body}
    [Return]            ${response.json()['access_token']}