## Connect App Connector
[![GitHub License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://github.com/trustedshops-public/connect-app-connector/blob/main/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=trustedshops-public_connect-app-connector&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=trustedshops-public_connect-app-connector)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=trustedshops-public_connect-app-connector&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=trustedshops-public_connect-app-connector)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=trustedshops-public_connect-app-connector&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=trustedshops-public_connect-app-connector)
[![CircleCI](https://circleci.com/gh/trustedshops/connect-etrusted-app-spike.svg?style=svg&circle-token=51d72e86b87f9bbe9a8dab15a236d21d1418bf8d)](https://app.circleci.com/pipelines/github/trustedshops/connect-etrusted-app-spike)

 - new - 

## Getting Started

First, run the development server:

```bash
yarn instal
#then
yarn run dev

```
### `yarn run dev:test`

Running the application locally with a test environment, using the mock baseLayerTest.js from the src/baseLayers folder.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### `yarn run build`

Builds the app for production to the `build` folder.

The production build contains a `fonts` folder and files `connector.es.js` , `connector.umd.js` and `style.css`.

## Connecting

Connecting the eTrasted connector is done by adding a `script` tag with a link to `connector.umd.j`s and a `link` tag with a link to `style.css` to the `index.html`.
To display the connector, you need to add a `div` tag with `id="eTrusted-connector"`


```js 
    <head>
        ...
        <link type="text/css" rel="stylesheet" href="https://static-app.connect.trustedshops.com/connector/style.css">
    </head>
    <body>
        <div id="app">
            ...
            <div id="eTrusted-connector"></div>
        </div>
        <script src="https://static-app.connect.trustedshops.com/connector/connector.umd.js"></script>
    </body>
```
