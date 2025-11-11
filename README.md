# SauceDemo Test Automation

## Task Description

This project contains automated tests for the SauceDemo login page (https://www.saucedemo.com/) using WebDriverIO.

### Use Cases

#### UC-1: Test Login form with empty credentials
1. Type any credentials into "Username" and "Password" fields
2. Clear the inputs
3. Hit the "Login" button
4. Check the error messages: "Username is required"

#### UC-2: Test Login form with credentials by passing Username
1. Type any credentials in username
2. Enter password
3. Clear the "Password" input
4. Hit the "Login" button
5. Check the error messages: "Password is required"

#### UC-3: Test Login form with credentials by passing Username & Password
1. Type credentials in username which are under Accepted username sections
2. Enter password as "secret_sauce"
3. Click on Login and validate the title "Swag Labs" in the dashboard

## Project Structure

```
saucedemo/
├── test/
│   ├── pages/
│   │   └── LoginPage.js          # Page Object Model for Login page
│   ├── data/
│   │   └── loginData.js          # Data provider for test data
│   └── specs/
│       └── login.test.js         # Test specifications
├── wdio.conf.js                  # WebDriverIO configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## Features

- ✅ **Parallel Execution**: Tests run in parallel across Chrome and Firefox browsers
- ✅ **Logging**: Comprehensive logging for all test steps and actions
- ✅ **Data Provider**: Parametrized tests using data providers
- ✅ **Page Object Model**: Clean separation of page logic and test logic
- ✅ **CSS Locators**: All locators use CSS selectors
- ✅ **Framework Assertions**: Uses WebDriverIO/Mocha assertions

## Prerequisites

- Node.js (v12.14 or higher)
- npm (Node Package Manager)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running Tests

### Run all tests (Chrome and Firefox in parallel):
```bash
npm test
```

### Run tests in Chrome only:
```bash
npm run test:chrome
```

### Run tests in Firefox only:
```bash
npm run test:firefox
```

## Test Configuration

- **Test Automation Tool**: WebDriverIO v7.32.0 (compatible with Node.js 12.14+)
- **Browsers**: Chrome and Firefox (headless mode)
- **Locators**: CSS selectors
- **Pattern**: Page Object Model
- **Assertions**: WebDriverIO/Mocha expect assertions
- **Parallel Execution**: Enabled (maxInstances: 2)
- **Logging**: Console logging with timestamps

## Test Data

The test data is stored in `test/data/loginData.js` and includes:
- Valid credentials for different user types (standard_user, problem_user, performance_glitch_user)
- Test data for negative test scenarios

## Page Object Model

The `LoginPage` class encapsulates all page elements and actions:
- Element selectors (username, password, login button, error messages)
- Page actions (open, enter credentials, clear fields, click login)
- Verification methods (get error messages, get page title)

## Logging

All tests include detailed logging:
- Test start/completion timestamps
- Step-by-step execution logs
- Test results and verification points

## Notes

- Tests run in headless mode by default for faster execution
- Parallel execution is configured to run 1 instance per browser
- All locators use CSS selectors as specified
- Error messages are verified using exact text matching

