/**
 * UC-3: Login Form - Valid Credentials (BDD)
 *
 * Feature: Login Form - Successful Login
 * As a user
 * I want to login successfully with valid credentials
 * So that I can access the application
 *
 * Scenario Outline: Successful login with valid credentials
 * Given: User is on the SauceDemo login page
 * When: User enters valid username and password and clicks login
 * Then: User is successfully logged in
 * And: User should see the page title "Swag Labs"
 * And: User should be on the inventory page
 */
const LoginPage = require("../pages/LoginPage");
const DataProvider = require("../utils/DataProvider");
const logger = require("../utils/Logger");

describe("Feature: Login Form - Valid Credentials", () => {
  const testDataArray = DataProvider.getLoginTestData();

  testDataArray.forEach((testData) => {
    describe(`Scenario: ${testData.testName}`, () => {
      // GIVEN: User is on the SauceDemo login page
      beforeEach(async () => {
        logger.info(
          `GIVEN: User is on the SauceDemo login page (${testData.testName})`
        );

        // For performance_glitch_user, set longer timeouts
        if (testData.username === "performance_glitch_user") {
          await browser.setTimeout({
            implicit: 30000,
            pageLoad: 90000,
            script: 90000,
          });
        }

        await LoginPage.open();
      });

      it('should successfully login and display "Swag Labs" title', async () => {
        DataProvider.logTestData("UC-3", testData);

        // GIVEN: User has entered username in the username field
        logger.info(
          `GIVEN: User has entered "${testData.username}" in the username field`
        );
        await LoginPage.enterUsername(testData.username);

        // GIVEN: User has entered a valid password in the password field
        logger.info(
          "GIVEN: User has entered a valid password in the password field"
        );
        await LoginPage.enterPassword(testData.password);

        // WHEN: User clicks the Login button
        logger.info("WHEN: User clicks the Login button");
        await LoginPage.clickLogin();

        // Wait a moment for navigation to start (especially important for Chrome)
        await browser.pause(1000);

        // Check for error messages first (in case login failed)
        // Only fail if there's an actual error message with text (not just an empty container)
        const hasError = await LoginPage.isErrorMessageDisplayed();
        if (hasError) {
          const errorMsg = await LoginPage.getErrorMessage();
          // Only throw error if there's actual error text (not just whitespace)
          if (errorMsg && errorMsg.trim().length > 0) {
            logger.error(`Login failed with error: ${errorMsg}`);
            throw new Error(`Login failed: ${errorMsg}`);
          }
        }

        // THEN: User should be successfully logged in
        logger.info("THEN: Verifying successful login");

        // Wait for successful login and verify
        // performance_glitch_user has intentional delays, so we need a very long timeout
        const timeout =
          testData.username === "performance_glitch_user" ? 150000 : 10000;
        const interval =
          testData.username === "performance_glitch_user" ? 2000 : 500;

        await browser.waitUntil(
          async () => {
            return await LoginPage.isLoginSuccessful();
          },
          {
            timeout: timeout,
            interval: interval,
            timeoutMsg:
              'Login was not successful - page title "Swag Labs" did not appear',
          }
        );

        expect(await LoginPage.isLoginSuccessful()).toBe(true);

        // AND: User should see the page title "Swag Labs"
        logger.info('AND: Verifying page title "Swag Labs" is displayed');
        const pageTitle = await LoginPage.getPageTitle();
        logger.info(`Page title displayed: ${pageTitle}`);

        // Assert page title matches exactly
        expect(pageTitle).toBe("Swag Labs");

        // AND: User should be on the inventory page
        logger.info("AND: Verifying user is on the inventory page");
        const currentUrl = await browser.getUrl();
        expect(currentUrl).toContain("/inventory.html");
        logger.info(`Successfully navigated to: ${currentUrl}`);
      });

      afterEach(() => {
        logger.info(`UC-3 test completed: ${testData.testName}`);
      });
    });
  });
});

