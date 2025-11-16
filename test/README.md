# SauceDemo Test Automation

This project contains automated tests for the SauceDemo website using WebDriverIO, implementing the Page Object Model pattern.

## Test Scenarios

### UC-1: Test login form with empty credentials

- Types credentials into Username and Password fields
- Clears both inputs
- Clicks Login button
- Verifies error message "Username is required"

### UC-2: Test login form with credentials by passing Username

- Types credentials into Username field
- Leaves Password field empty
- Clicks Login button
- Verifies error message "Password is required"

### UC-3: Test login form with valid Username and Password

- Enters username from Accepted usernames list
- Enters valid password (secret_sauce)
- Clicks Login button
- Verifies successful login by checking "Swag Labs" title appears

## Project Structure

```
test/
├── pages/
│   └── LoginPage.js          # Page Object Model for login page
├── specs/
│   ├── UC1_EmptyCredentials.test.js
│   ├── UC2_UsernameOnly.test.js
│   └── UC3_ValidCredentials.test.js
└── utils/
    ├── DataProvider.js        # Data provider for parameterized tests
    └── Logger.js              # Winston logger utility
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Make sure you have Node.js installed (v16.13.0 or higher, or v18+ recommended)

**Note:** If you're using Node.js v12, you'll need to upgrade. WebDriverIO v8 requires Node.js 16.13+ or 18+.

## Running Tests

### Run all tests:

```bash
npm test
```

### Run specific test:

```bash
npx wdio run wdio.conf.js --spec test/specs/UC1_EmptyCredentials.test.js
```

## Features

- ✅ WebDriverIO test automation framework
- ✅ Chrome and Firefox browser support
- ✅ CSS selectors for all elements
- ✅ Page Object Model pattern
- ✅ Parallel execution (maxInstances: 2)
- ✅ Data Provider for parameterized tests
- ✅ Winston logger for data logging
- ✅ Mocha framework with BDD structure (Given-When-Then)
- ✅ Comprehensive assertions with error handling

## Configuration

The `wdio.conf.js` file contains:

- Browser capabilities for Chrome and Firefox
- Parallel execution configuration
- Mocha framework settings
- Screenshot on failure
- Logging configuration

## Logs

Test execution logs are stored in the `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

## Reports

Test reports are generated in the `reports/` directory in JUnit XML format.
