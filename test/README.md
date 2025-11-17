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
├── specs/                     # Mocha BDD test files
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
- ✅ **Mocha framework with BDD interface** (describe/it syntax)
- ✅ Comprehensive assertions with error handling

## BDD Implementation

The project uses **Mocha with BDD interface** for Behavior-Driven Development. BDD focuses on describing behavior in natural language that both technical and non-technical stakeholders can understand.

### BDD Structure

Tests are written using Mocha's BDD interface with the following structure:

- **`describe()`**: Groups related test scenarios (Feature/User Story level)
- **`it()`**: Describes individual test cases in natural language
- **`beforeEach()` / `afterEach()`**: Setup and teardown hooks

### Given-When-Then Pattern

All tests follow the **Given-When-Then** pattern:

- **Given**: Initial context/setup (in `beforeEach()` or test setup)
- **When**: Action performed (user interactions)
- **Then**: Expected outcome (assertions/verifications)

### Example: UC-1 Test Structure

```javascript
describe("UC-1: Login Form - Empty Credentials", () => {
  // GIVEN: User is on the login page
  beforeEach(async () => {
    await LoginPage.open();
  });

  it('should display "Username is required" error when both fields are empty', async () => {
    // GIVEN: User has entered temporary credentials
    await LoginPage.enterUsername("test_user");
    await LoginPage.enterPassword("test_password");

    // WHEN: User clears both fields and clicks login
    await LoginPage.clearUsername();
    await LoginPage.clearPassword();
    await LoginPage.clickLogin();

    // THEN: Error message should appear
    expect(await LoginPage.isErrorMessageDisplayed()).toBe(true);
    expect(await LoginPage.getErrorMessage()).toMatch(/Username is required/i);
  });
});
```

### Test Scenarios in BDD Format

All test scenarios follow the BDD pattern:

#### UC-1: Empty Credentials

- **Given**: User is on the login page
- **When**: User clears both username and password fields and clicks login
- **Then**: System displays "Username is required" error message

#### UC-2: Username Only

- **Given**: User is on the login page
- **When**: User enters username but leaves password empty and clicks login
- **Then**: System displays "Password is required" error message

#### UC-3: Valid Credentials

- **Given**: User is on the login page
- **When**: User enters valid username and password and clicks login
- **Then**: User is successfully logged in and sees "Swag Labs" title

### BDD Best Practices Used

1. **Natural Language**: Test descriptions use plain English (`it('should display...')`)
2. **Behavior Focus**: Tests describe what the system should do, not how it's implemented
3. **Clear Structure**: Each test has a single, clear purpose
4. **Readable Assertions**: Expectations are written in a way that's easy to understand
5. **Organized Hooks**: Setup and teardown are clearly separated using `beforeEach()` and `afterEach()`

### BDD Benefits

- **Readable**: Test descriptions read like specifications
- **Maintainable**: Clear structure makes tests easy to update
- **Collaborative**: Non-technical team members can understand test scenarios
- **Documentation**: Tests serve as living documentation of system behavior
- **Testability**: BDD structure makes it easy to identify what's being tested

## Configuration

The `wdio.conf.js` file contains:

- Browser capabilities for Chrome and Firefox
- Parallel execution configuration
- Mocha framework with BDD interface (`ui: "bdd"`)
- Screenshot on failure
- Logging configuration

## Logs

Test execution logs are stored in the `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

## Reports

Test reports are generated in the `reports/` directory in JUnit XML format.
