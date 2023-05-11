*** Settings ***
Library         SeleniumLibrary
Resource        ../resources/keywords/Common.robot
Resource        ../resources/keywords/ChannelMappingPopup.robot
Resource        ../resources/keywords/ChannelMappingCommon.robot
Resource        ../resources/config.robot

Suite Setup     Run Application  base_layer_channels=1_shop  mapped_channels=none
Suite Teardown  End Application Run

*** Variables ***

*** Test Cases ***
Automatic single channel mapping
    When log in as ${default_account}
    Then Channel Mapping Popup Is Not Displayed
    When open Settings tab
    Then Wait Until Channel Is Mapped        ${base_layer_channel1}     ${default_account__channel.name}
