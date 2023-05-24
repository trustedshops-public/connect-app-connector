*** Variables ***
# External variables are stored in Resources/local-env.sh

${browser}              headlesschrome
${url}                  http://localhost:3000

# ETRUSTED ACCOUNTS
&{default_account}            client_id=%{DEFAULT_ACCOUNT_CLIENT_ID}   client_secret=%{DEFAULT_ACCOUNT_CLIENT_SECRET}  username=qa-test-automation-03e52e+etrusted_2_03022022012556@inbox.mailtrap.io   password=%{DEFAULT_ACCOUNT_PASSWORD}
&{default_account__channel}   id=chl-b2c3bf02-f7e3-4a48-92a9-80e6f8420cdc  name=03022022012556_german_shop.com  ts_id=XB1E4FF002CE3D90357BA482D34A6A89C
# This default account has a single channel & widgets set up

&{multi_channel_account}                client_id=%{MULTI_CHANNEL_ACCOUNT_CLIENT_ID}  client_secret=%{MULTI_CHANNEL_ACCOUNT_CLIENT_SECRET}  username=qa-test-automation-03e52e+1_25022022012613@inbox.mailtrap.io  password=%{MULTI_CHANNEL_ACCOUNT_PASSWORD}
&{multi_channel_account__channel1}      id=chl-0886eebe-e0a9-4d71-8607-e130ecde5cfe  name=25022022012613_austria_shop.com  ts_id=X305DE9A4992708534AFADB4232B26CE7
&{multi_channel_account__channel2}      id=chl-5db865bc-af28-4794-a964-07c96027ca69  name=25022022012613_german_shop.com  ts_id=XBD67F6205D8C822AA8E2FC5F1E16CA16

&{no_widgets_account}              client_id=%{NO_WIDGETS_ACCOUNT_CLIENT_ID}  client_secret=%{NO_WIDGETS_ACCOUNT_CLIENT_SECRET}  username=qa-test-automation-03e52e+0_25022022012444@inbox.mailtrap.io  password=%{NO_WIDGETS_ACCOUNT_PASSWORD}
&{no_widgets_account__channel}     id=chl-2c99ae3f-336c-49d7-bfe9-b6ce28a7e5eb    name=24032021170843_german_shop.com   ts_id=XD4FB716D17D9E6E239810339F090A30A

# BASE LAYER DATA - this must match the data used in src/baseLayers/testData
${base_layer_channel1}           shop-7e52920a-2722-4881-9908-ecec98c716e4
${base_layer_channel2}           shop-1e570f63-10f8-4d5a-ae18-21d3d933eb93
${base_layer_matching_channel1}  austria-shop
${base_layer_matching_channel2}  german-shop
