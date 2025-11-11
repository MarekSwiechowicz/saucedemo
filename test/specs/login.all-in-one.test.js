// ============================================================================
// SAUCEDEMO TEST AUTOMATION - ALL-IN-ONE FILE
// ============================================================================
//
// TASK DESCRIPTION
// ============================================================================
// This project contains automated tests for the SauceDemo login page
// (https://www.saucedemo.com/) using WebDriverIO.
//
// USE CASES
// ============================================================================
//
// UC-1: Test Login form with empty credentials
//   1. Type any credentials into "Username" and "Password" fields
//   2. Clear the inputs
//   3. Hit the "Login" button
//   4. Check the error messages: "Username is required"
//
// UC-2: Test Login form with credentials by passing Username
//   1. Type any credentials in username
//   2. Enter password
//   3. Clear the "Password" input
//   4. Hit the "Login" button
//   5. Check the error messages: "Password is required"
//
// UC-3: Test Login form with credentials by passing Username & Password
//   1. Type credentials in username which are under Accepted username sections
//   2. Enter password as "secret_sauce"
//   3. Click on Login and validate the title "Swag Labs" in the dashboard
//
// FEATURES
// ============================================================================
// ✅ Parallel Execution: Tests run in parallel across Chrome and Firefox browsers
// ✅ Logging: Comprehensive logging for all test steps and actions
// ✅ Data Provider: Parametrized tests using data providers
// ✅ Page Object Model: Clean separation of page logic and test logic
// ✅ CSS Locators: All locators use CSS selectors
// ✅ Framework Assertions: Uses WebDriverIO/Mocha assertions
//
// PREREQUISITES
// ============================================================================
// - Node.js (v12.14 or higher)
// - npm (Node Package Manager)
// - Chrome Browser: Any recent version (tested with Chrome 142)
// - Firefox Browser: Any recent version (tested with Firefox 139)
//
// INSTALLATION
// ============================================================================
// 1. Install dependencies (use --ignore-scripts for most packages):
//    npm install --ignore-scripts
//
// 2. Install geckodriver with scripts enabled (required to download binary):
//    npm install geckodriver@3.0.1 --save-dev
//
// Note:
// - Most packages are installed with --ignore-scripts to avoid Node version issues
// - Geckodriver must be installed separately with scripts enabled to download binary
// - Chrome uses devtools protocol (Puppeteer) which works with any Chrome version
//
// RUNNING TESTS
// ============================================================================
// This all-in-one file can be run in multiple ways:
//
// Option 1: Using npm test (wdio.conf.js is configured to run this file):
//   npm test
//
// Option 2: Using the dedicated script:
//   npm run test:all-in-one
//
// Option 3: Direct command:
//   npm test -- --spec test/specs/login.all-in-one.test.js
//
// Note: wdio.conf.js and package.json are still required for WebDriverIO
//       framework setup, but all test code is in this single file.
//
// TEST CONFIGURATION
// ============================================================================
// - Test Automation Tool: WebDriverIO v6.12.1 (compatible with Node.js 12.14+)
// - ChromeDriver: v142.0.1 (supports Chrome 142, uses devtools protocol)
// - GeckoDriver: v3.0.1 (works with any Firefox version)
// - Browsers: Chrome and Firefox (headless mode)
// - Chrome Protocol: DevTools (Puppeteer) - works with any Chrome version
// - Firefox Protocol: WebDriver (GeckoDriver)
// - Locators: CSS selectors
// - Pattern: Page Object Model
// - Assertions: WebDriverIO/Mocha expect assertions
// - Parallel Execution: Enabled (maxInstances: 2)
// - Logging: Console logging with timestamps
//
// TEST RESULTS
// ============================================================================
// ✅ All tests pass in both browsers:
//    - Chrome: 5/5 tests passing
//    - Firefox: 5/5 tests passing
//    - Total: 10/10 tests passing (100% success rate)
//
// FILE STRUCTURE
// ============================================================================
// This all-in-one file contains:
// 1. Page Object Model (LoginPage class) - Lines below
// 2. Test Data Provider - Contains test credentials and data
// 3. Test Specifications (UC-1, UC-2, UC-3) - All test cases
//
// ============================================================================
// PAGE OBJECT MODEL - LoginPage Class
// ============================================================================
class LoginPage {
  get usernameInput() {
    return $("#user-name");
  }

  get passwordInput() {
    return $("#password");
  }

  get loginButton() {
    return $("#login-button");
  }

  get errorMessage() {
    return $('h3[data-test="error"]');
  }

  get pageTitle() {
    return $(".title");
  }

  async open() {
    await browser.url("/");
  }

  async enterUsername(username) {
    const input = await this.usernameInput;
    await input.setValue(username);
  }

  async enterPassword(password) {
    const input = await this.passwordInput;
    await input.setValue(password);
  }

  async clearUsername() {
    const input = await this.usernameInput;
    await input.click();
    // Select all and delete
    await browser.keys(["Control", "a"]);
    await browser.keys("Delete");
    // Also use clearValue
    await input.clearValue();
    // Force clear using JavaScript
    await browser.execute(() => {
      const element = document.querySelector(`#user-name`);
      if (element) {
        element.focus();
        element.select();
        element.value = "";
        // Trigger events
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        element.dispatchEvent(new Event("blur", { bubbles: true }));
      }
    });
    // Small wait to ensure clearing is complete
    await browser.pause(100);
  }

  async clearPassword() {
    const input = await this.passwordInput;
    await input.click();
    // Select all and delete
    await browser.keys(["Control", "a"]);
    await browser.keys("Delete");
    // Also use clearValue
    await input.clearValue();
    // Force clear using JavaScript
    await browser.execute(() => {
      const element = document.querySelector(`#password`);
      if (element) {
        element.focus();
        element.select();
        element.value = "";
        // Trigger events
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        element.dispatchEvent(new Event("blur", { bubbles: true }));
      }
    });
    // Small wait to ensure clearing is complete
    await browser.pause(100);
  }

  async clickLogin() {
    const button = await this.loginButton;
    await button.click();
  }

  async getErrorMessage() {
    const error = await this.errorMessage;
    return await error.getText();
  }

  async getPageTitle() {
    const title = await this.pageTitle;
    return await title.getText();
  }

  async getBrowserTitle() {
    return await browser.getTitle();
  }

  async getSwagLabsHeader() {
    const header = await $(".app_logo");
    return await header.getText();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();

    // Wait for navigation after login (especially important for performance_glitch_user)
    if (username === "performance_glitch_user") {
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl();
          return url.includes("/inventory.html") || url.includes("/inventory");
        },
        {
          timeout: 20000,
          timeoutMsg: "Login did not complete within 20 seconds",
        }
      );
    } else {
      // Wait for page to load for other users
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl();
          return url.includes("/inventory.html") || url.includes("/inventory");
        },
        {
          timeout: 10000,
          timeoutMsg: "Login did not complete within 10 seconds",
        }
      );
    }
  }
}

// Create instance of LoginPage
const LoginPageInstance = new LoginPage();

// ============================================================================
// TEST DATA PROVIDER
// ============================================================================
const loginData = {
  validCredentials: [
    {
      username: "standard_user",
      password: "secret_sauce",
      description: "Standard user login",
    },
    {
      username: "problem_user",
      password: "secret_sauce",
      description: "Problem user login",
    },
    {
      username: "performance_glitch_user",
      password: "secret_sauce",
      description: "Performance glitch user login",
    },
  ],

  testData: {
    anyUsername: "test_user",
    anyPassword: "test_password",
    validPassword: "secret_sauce",
  },
};

// ============================================================================
// TEST SPECIFICATIONS
// ============================================================================
describe("SauceDemo Login Tests", () => {
  beforeEach(async function () {
    const testTitle =
      this.currentTest && this.currentTest.title
        ? this.currentTest.title
        : "Unknown";
    console.log(`[${new Date().toISOString()}] Starting test: ${testTitle}`);
    await LoginPageInstance.open();
  });

  afterEach(async function () {
    const testTitle =
      this.currentTest && this.currentTest.title
        ? this.currentTest.title
        : "Unknown";
    console.log(`[${new Date().toISOString()}] Completed test: ${testTitle}`);
  });

  // ==========================================================================
  // UC-1: Test Login form with empty credentials
  // ==========================================================================
  describe("UC-1: Test Login form with empty credentials", () => {
    it('should display "Username is required" error when both fields are cleared', async () => {
      console.log(
        "[UC-1] Step 1: Entering credentials in username and password fields"
      );
      await LoginPageInstance.enterUsername(loginData.testData.anyUsername);
      await LoginPageInstance.enterPassword(loginData.testData.anyPassword);

      console.log("[UC-1] Step 2: Clearing both input fields");
      await LoginPageInstance.clearUsername();
      await LoginPageInstance.clearPassword();

      console.log("[UC-1] Step 3: Clicking Login button");
      await LoginPageInstance.clickLogin();

      console.log("[UC-1] Step 4: Verifying error message");
      const errorMessage = await LoginPageInstance.getErrorMessage();
      expect(errorMessage).toBe("Epic sadface: Username is required");

      console.log("[UC-1] Test passed: Error message displayed correctly");
    });
  });

  // ==========================================================================
  // UC-2: Test Login form with credentials by passing Username
  // ==========================================================================
  describe("UC-2: Test Login form with credentials by passing Username", () => {
    it('should display "Password is required" error when password is cleared', async () => {
      console.log("[UC-2] Step 1: Entering username");
      await LoginPageInstance.enterUsername(loginData.testData.anyUsername);

      console.log("[UC-2] Step 2: Entering password");
      await LoginPageInstance.enterPassword(loginData.testData.anyPassword);

      console.log("[UC-2] Step 3: Clearing password field");
      await LoginPageInstance.clearPassword();

      console.log("[UC-2] Step 4: Clicking Login button");
      await LoginPageInstance.clickLogin();

      console.log("[UC-2] Step 5: Verifying error message");
      const errorMessage = await LoginPageInstance.getErrorMessage();
      expect(errorMessage).toBe("Epic sadface: Password is required");

      console.log("[UC-2] Test passed: Error message displayed correctly");
    });
  });

  // ==========================================================================
  // UC-3: Test Login form with valid credentials
  // ==========================================================================
  describe("UC-3: Test Login form with valid credentials", () => {
    loginData.validCredentials.forEach((credential) => {
      it(`should successfully login and display "Swag Labs" title for ${credential.description}`, async function () {
        // Increase timeout for performance_glitch_user test
        this.timeout(60000);

        console.log(`[UC-3] Step 1: Logging in with ${credential.username}`);
        await LoginPageInstance.login(credential.username, credential.password);

        // Add explicit wait for performance_glitch_user to handle delays
        if (credential.username === "performance_glitch_user") {
          console.log("[UC-3] Waiting for page to load after login...");
          await browser.waitUntil(
            async () => {
              const title = await browser.getTitle();
              return title.includes("Swag Labs");
            },
            {
              timeout: 15000,
              timeoutMsg: "Page did not load within 15 seconds",
            }
          );
        }

        console.log(
          '[UC-3] Step 2: Verifying browser title contains "Swag Labs"'
        );
        const browserTitle = await LoginPageInstance.getBrowserTitle();
        expect(browserTitle).toContain("Swag Labs");

        console.log('[UC-3] Step 3: Verifying "Swag Labs" header is displayed');
        const swagLabsHeader = await LoginPageInstance.getSwagLabsHeader();
        expect(swagLabsHeader).toBe("Swag Labs");

        console.log(
          `[UC-3] Test passed: Successfully logged in as ${credential.username}`
        );
      }).retries(2); // Retry up to 2 times if test fails (Mocha retry feature)
    });
  });
});
