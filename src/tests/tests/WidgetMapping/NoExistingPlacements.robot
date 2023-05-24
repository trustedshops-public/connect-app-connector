*** Settings ***
Library         SeleniumLibrary
Library         PageObjectLibrary
Resource        ../resources/keywords/Common.robot
Resource        ../resources/keywords/Header.robot
Resource        ../resources/keywords/WidgetsTab.robot

Suite Setup     Run Application  base_layer_channels=2_shops  mapped_channels=1_shop_mapped     mapped_widgets=none
Suite Teardown  End Application Run

*** Variables ***
${srev_widget_id}   wdg-3a72c50d-dd76-48f8-8386-59897ce8273f
${prev_widget_id}   wdg-7432a4e5-cea3-415e-b2d2-fc0a28562751

*** Test Cases ***
Account with no widgets
    When log in as ${no_widgets_account}
    And open Widgets tab
    Then 'no widgets' text is shown

Account with widgets
    When log in as ${default_account}
    And open Widgets tab
    Then all widgets are listed     ${default_account}  ${default_account__channel}
    # Possible test extension - ensure all widget data is displayed correctly

Place a SREV widget
    When log in as ${default_account}
    And open Widgets tab
    Then widget status is  action required   ${srev_widget_id}

    When choose a widget location   ${srev_widget_id}   footer
    And save widgets
    Then save message appears
    Then widget status is  integrated    ${srev_widget_id}

Place a PREV widget
    When log in as ${default_account}
    And open Widgets tab
    Then widget status is  action required   ${prev_widget_id}

    When choose a widget location      ${prev_widget_id}  footer
    And save widgets
    Then widget status is  action required   ${prev_widget_id}
    And error appears      Please select a product id before saving your changes

    Given wait until message disappears
    When choose a product identifier of open widget config   ${prev_widget_id}   data-gtin
    And save widgets
    Then save message appears
    And widget status is  integrated        ${prev_widget_id}
