***Settings***
Library     Collections
Resource    ../api/WidgetsApi.robot

***Variables***
${no_widgets_text}      app=#no_widgets_text
${save_widgets_button}  app=#button_saveWidgetsChanges
${widget_row}           app=[data-testid=widget_row]
#Append widget id:
${widget_id_locator}    app=[data-testid=widget_id]
${widget_type}          app=#widget_type_
${widget_status}        app=#widget_status_
${widget_content}       app=#widget_content_
${widget_location_button}      app=button#select_widgetLocation_        
${widget_expand}        app=#widget_expand_
${widget_product_id_button}    app=#select_productID_
#Append location id:
${widget_location_list_item}   app=li#select_widgetLocation_            
#Append product identifier id:
${widget_product_id_list_item}  app=li#select_productID_

***Keywords***
# Page interaction
Widgets Tab Is Loaded
    Wait Until Element is Visible   ${save_widgets_button}

'No Widgets' Text Is Shown
    Element Should Be Visible       ${no_widgets_text}

Widget Is Not Listed
    [Arguments]     ${widget_id}
    Wait Until Page Does Not Contain Element    ${widget_type}${widget_id}

Choose A Widget Location
    [Arguments]     ${widget_id}    ${location}
    Click Button    ${widget_location_button}${widget_id}
    Click Element   ${widget_location_list_item}${location}

Choose A Product Identifier
    [Arguments]     ${widget_id}    ${product_identifier}
    Click Button    ${widget_expand}${widget_id}
    Click Button    ${widget_product_id_button}${widget_id}
    Click Element   ${widget_product_id_list_item}${product_identifier}

Choose A Product Identifier Of Open Widget Config
    [Arguments]     ${widget_id}    ${product_identifier}
    Click Button    ${widget_product_id_button}${widget_id}
    Click Element   ${widget_product_id_list_item}${product_identifier}

Save Widgets
    Click Button    ${save_widgets_button}

Widget Status Is
    [Arguments]     ${expected_status}  ${widget_id}
    ${actual_status}    Get Text  ${widget_status}${widget_id}
    Should Be Equal As Strings      ${expected_status}  ${actual_status}    ignore_case=${TRUE}

# High-level keywords
Get Widget Ids From Table
    Wait Until Page Contains Element    ${widget_id_locator}
    @{widget_ids}           Create List
    ${widget_id_elements}   Get Web Elements    ${widget_id_locator}
    FOR  ${widget_id_element}  IN  @{widget_id_elements}
        ${id}   Get Text    ${widget_id_element}
        Append To List  ${widget_ids}   ${id}
    END
    [Return]    ${widget_ids}

Get Widget Ids From Api
    [Arguments]     ${account}  ${channel}
    @{api_widgets_data}     Get List Of Widgets From Api        ${account.username}     ${account.password}     ${channel.id}
    @{widget_ids}  Create List

    FOR     ${item}     IN      @{api_widgets_data}
        Append To List  ${widget_ids}   ${item['id']}
    END
    [Return]    ${widget_ids}

All Widgets Are Listed
    [Arguments]             ${account}  ${channel}
    [Documentation]         Gets a list of widgets from the api for the passed etrusted channel, then ensure that every widget id in that list is displayed in the table
    
    Wait Until Element Is Visible   ${widget_row}

    ${widget_ids_from_api}       Get Widget Ids From Api    ${account}  ${channel}
    ${widget_ids_from_table}     Get Widget Ids From Table

    FOR     ${id}   IN      @{widget_ids_from_api}
        Should Be True      "${id}" in "${widget_ids_from_table}"
    END