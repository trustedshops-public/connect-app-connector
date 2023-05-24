*** Settings ***
Library         SeleniumLibrary
Resource        ../resources/keywords/Common.robot
Resource        ../resources/keywords/ChannelMappingPopup.robot
Resource        ../resources/keywords/ChannelMappingCommon.robot
Resource        ../resources/config.robot

Suite Setup     Run Application  base_layer_channels=2_shops_matching_etrusted_channel_data  mapped_channels=none
Suite Teardown  End Application Run

*** Test Cases ***

Automatic multiple channel mapping
    When log in as ${multi_channel_account}
    Then Channel Mapping Popup Is Not Displayed
    When open Settings tab
    Then Wait Until Channel Is Mapped  ${base_layer_matching_channel1}     ${multi_channel_account__channel1.name}
    And Wait Until Channel Is Mapped   ${base_layer_matching_channel2}     ${multi_channel_account__channel2.name}
