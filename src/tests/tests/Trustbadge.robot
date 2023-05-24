*** Settings ***
Library         SeleniumLibrary
Library         PageObjectLibrary
Resource        ../resources/keywords/Common.robot
Resource        ../resources/keywords/TrustbadgeTab.robot

Suite Setup     Run Application  base_layer_channels=2_shops  mapped_channels=1_shop_mapped
Suite Teardown  End Application Run

*** Test Cases ***
Activate the Trustbadge
    When log in as ${default_account}
    And activate Trustbadge
    Then radio buttons are enabled
    When view embed code
    Then embed code contains     data-disable-trustbadge="${FALSE}"
    And embed code contains      //widgets.trustedshops.com/js/${default_account__channel.ts_id}.js

Deactivate the Trustbadge
    Given log in as ${default_account}
    And activate Trustbadge
    And view embed code
    
    When deactivate Trustbadge
    Then radio buttons are disabled
    Then embed code contains     data-disable-trustbadge="${TRUE}"
    And embed code contains      //widgets.trustedshops.com/js/${default_account__channel.ts_id}.js