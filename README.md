
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
