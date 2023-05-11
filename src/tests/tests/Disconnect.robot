*** Settings ***
Library         SeleniumLibrary
Library         PageObjectLibrary
Resource        ../resources/keywords/Common.robot
Resource        ../resources/keywords/ChannelMappingCommon.robot
Resource        ../resources/keywords/ChannelMappingPopup.robot
Resource        ../resources/keywords/SettingsTab.robot

Suite Setup     Run Application  base_layer_channels=2_shops  mapped_channels=1_shop_mapped
Suite Teardown  End Application Run

*** Test Cases ***
Disconnect
    Given log in as ${default_account}    
    When open Settings tab
    And disconnect
    Then authentication page is loaded
