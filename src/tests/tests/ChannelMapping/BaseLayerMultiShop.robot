*** Settings ***
Library         SeleniumLibrary
Resource        ../resources/keywords/Common.robot
Resource        ../resources/keywords/ChannelMappingPopup.robot
Resource        ../resources/keywords/ChannelMappingCommon.robot
Resource        ../resources/config.robot

Suite Setup     Run Application  base_layer_channels=2_shops  mapped_channels=none
Suite Teardown  End Application Run

*** Test Cases ***
Manual channel mapping
    When log in as ${default_account}
    Then channel mapping popup is displayed
    When map a channel                    ${base_layer_channel1}     ${default_account__channel.id}
    And save channel mapping in popup
    Then application is enabled
    When open Settings tab
    Then channel is mapped                ${base_layer_channel1}     ${default_account__channel.name}
