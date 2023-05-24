***Variables***
${prevs_toggle}         app=#switch_button_reviewInvites
${use_estimate_toggle}  app=#text_use_send

***Keywords***
Invites Tab Is Loaded
    Wait Until Page Contains Element    ${use_estimate_toggle}

'Send review invites for products' section is displayed
    Page Should Contain Element     ${prevs_toggle}

'Send review invites for products' section is not displayed
    Page Should Not Contain Element     ${prevs_toggle}