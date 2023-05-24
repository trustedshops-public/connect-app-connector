*** Settings ***
Library         SeleniumLibrary
Resource        ../resources/keywords/Common.robot
Resource        ../resources/keywords/ChannelMappingPopup.robot
Resource        ../resources/keywords/ChannelMappingCommon.robot
Resource        ../resources/config.robot

Suite Setup     Run Application  base_layer_channels=2_shops  mapped_channels=1_shop_mapped
Suite Teardown  End Application Run

*** Variables ***

*** Test Cases ***
Channels already mapped
    When log in as ${default_account}
    Then Channel Mapping Popup Is Not Displayed

Change channel mapping
    When log in as ${default_account}
    And open Settings tab
    And map a channel                ${base_layer_channel2}     ${default_account__channel.id}
    And save channel mapping in Settings
    And open Invites tab
    And open Settings tab
    Then channel is mapped           ${base_layer_channel2}     ${default_account__channel.name}

Remove channel mapping
    When log in as ${default_account}
    And open Settings tab
    And unmap a channel              ${base_layer_channel1}
    And save channel mapping in Settings
    And open Invites tab
    And open Settings tab
    Then channel is unmapped         ${base_layer_channel1}