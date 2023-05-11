# Automated tests for Connect App

This is a series of tests that automatically check the Connect App is working as expected via the UI.

Each suite initialises the application with a different set of test data representing the "baseLayer" (i.e. the shop system and data it may already have saved, or no data in the case of a first login).

Each test then logs on as a specific eTrusted account, representing different situations such as single or multiple channels, widgets configured or no existing widgets etc. 

All tests run against the Test environment.

*Technology*

The tests are written with Python, Robot Framework & several Robot libraries:
 - [SeleniumLibrary](https://github.com/robotframework/SeleniumLibrary) - interacts with UI (using ChromeDriver; [keyword docs](https://robotframework.org/SeleniumLibrary/SeleniumLibrary.html))
 - [RequestsLibrary](https://github.com/MarketSquare/robotframework-requests) - sends API calls ([keyword docs](https://marketsquare.github.io/robotframework-requests/doc/RequestsLibrary.html))
 - [Pabot](https://github.com/mkorpela/pabot) - runs parallel tests

*Structure*
- tests/ - test specifications
- resources/
    - config.robot - test data including logins
    - api/ - robot keywords to call eTrusted APIs
    - keywords/ - robot keywords for interacting with the application via Selenium
    - scripts/ - bash scripts used for installation and run steps, as well as local environment variables
- results/ - auto-generated folder of xml reports & screenshots, created when tests are run

The tests also make use of the test data sets in src/baseLayers/testData that are used to initialise the app. 

## Development

### Prerequisites

Use the following commands to install all dependencies:

    npm install
    npm run test-install

You must set up all environment variables on your machine for the tests to run locally, using the Resources/scripts/local-env.sh file created by the install script. Environment variables are stored in PasswordState > Quality Assurance > Connect App Secrets. 

### Build and Run

Use the following command to run all tests locally:

    npm run test-local

Note that there may be failures when running tests locally due to clashing parallel runs on your machine. If this occurs, either run by test/suite (as described below) or push to CircleCI.

You can pass additional options to this command after "--", as supported by [Robot Framework](http://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#id943). 

For example, to run a specific test:

    npm run test-local -- -t User_can_authenticate

Or to log at debug level:

    npm run test-local -- --loglevel DEBUG

### Debugging Tips

If tests fail, check the report.html file in Results for further details / screenshots. 

You can add extra logging as specified above, or the keyword 'Capture Page Screenshot', and rerun the specific test.

You may also be able to reproduce the issue manually by:
1. Manually running the application run command from Suite > Setup > Start Process and opening the URL in your browser.
2. Logging in as the account specified in the test, and repeating the steps in the test.

### Workflow

#### Continuous Integration Pipeline

The tests are integrated into CircleCI as a 'test' job that will run whenever code is checked in. 