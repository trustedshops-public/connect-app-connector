*** Settings ***
Library         SeleniumLibrary
Library         PageObjectLibrary
Resource        ../resources/keywords/Common.robot
Resource        ../resources/keywords/Header.robot
Resource        ../resources/keywords/WidgetsTab.robot

Suite Setup     Run Application  base_layer_channels=2_shops  mapped_channels=1_shop_mapped     mapped_widgets=widgets_mapped
Suite Teardown  End Application Run

*** Variables ***
${deleted_widget_id}   wdg-deleted-in-api
${placed_widget_id}    wdg-7432a4e5-cea3-415e-b2d2-fc0a28562751

*** Test Cases ***
Placed widget is deleted
    When log in as ${default_account}
    And open Widgets tab
    Then widget status is  action required  ${deleted_widget_id}

    When choose a widget location   ${deleted_widget_id}    deselect
    And save widgets
    Then save message appears
    Then widget is not listed   ${deleted_widget_id} 

User unplaces a widget
    When log in as ${default_account}
    And open Widgets tab
    Then widget status is  integrated  ${placed_widget_id}

    When choose a widget location   ${placed_widget_id}    deselect
    And save widgets
    Then save message appears
    Then widget status is  action required  ${placed_widget_id}