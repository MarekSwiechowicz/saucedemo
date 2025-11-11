# All-in-One Test File

## File Location

`test/specs/login.all-in-one.test.js`

## What's Included

This single file contains all the code needed for the SauceDemo login tests:

1. **Page Object Model** - `LoginPage` class with all page elements and methods
2. **Test Data Provider** - `loginData` object with test credentials
3. **Test Specifications** - All three test cases (UC-1, UC-2, UC-3)

## Contents

### 1. LoginPage Class (Page Object Model)

- Element selectors (CSS locators)
- Page actions (open, enter credentials, clear fields, click login)
- Verification methods (get error messages, get page title, get browser title)
- Login method with navigation waiting

### 2. Test Data Provider

- `validCredentials`: Array of valid login credentials for UC-3
- `testData`: Test data for negative test scenarios

### 3. Test Specifications

- **UC-1**: Test Login form with empty credentials
- **UC-2**: Test Login form with credentials by passing Username
- **UC-3**: Test Login form with valid credentials (parametrized with data provider)

## Usage

### Run the all-in-one file:

```bash
npm test -- --spec test/specs/login.all-in-one.test.js
```

### Or update wdio.conf.js to use only this file:

Change the specs line to:

```javascript
specs: ["./test/specs/login.all-in-one.test.js"],
```

## Features

✅ **Page Object Model** - Clean separation of page logic  
✅ **Data Provider** - Parametrized tests using forEach  
✅ **Logging** - Comprehensive logging for all test steps  
✅ **Parallel Execution** - Works with existing wdio.conf.js  
✅ **CSS Locators** - All locators use CSS selectors  
✅ **Framework Assertions** - Uses WebDriverIO/Mocha expect

## Test Results

- Chrome: 5/5 tests passing
- Firefox: 5/5 tests passing
- Total: 10/10 tests passing (100% success rate)
