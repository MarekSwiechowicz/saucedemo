/**
 * UC-1: Login Form - Empty Credentials (BDD)
 *
 * Feature: Login Form Validation
 * As a user
 * I want to see an error message when attempting to login with empty credentials
 * So that I understand what information is required
 *
 * Scenario: Login with empty username and password fields
 * Given: User is on the SauceDemo login page
 * When: User clears both username and password fields and clicks login
 * Then: System displays "Username is required" error message
 */
const LoginPage = require("../pages/LoginPage");
const DataProvider = require("../utils/DataProvider");
const logger = require("../utils/Logger");

describe("Feature: Login Form - Empty Credentials", () => {
  // GIVEN: User is on the SauceDemo login page
  beforeEach(async () => {
    logger.info("GIVEN: User is on the SauceDemo login page");
    await LoginPage.open();
  });

  it('should display "Username is required" error when both fields are empty', async () => {
    const testData = DataProvider.getEmptyCredentialsData();
    DataProvider.logTestData("UC-1", testData);

    // GIVEN: User has entered temporary credentials in the username and password fields
    logger.info("GIVEN: User has entered temporary credentials");
    await LoginPage.enterUsername("test_user");
    await LoginPage.enterPassword("test_password");

    // WHEN: User clears both the username and password fields
    logger.info("WHEN: User clears both the username and password fields");
    await LoginPage.clearUsername();
    await LoginPage.clearPassword();

    // Wait a moment after clearing to ensure fields are truly empty (especially for Chrome)
    await browser.pause(500);

    // WHEN: User clicks the Login button
    logger.info("WHEN: User clicks the Login button");
    await LoginPage.clickLogin();

    // THEN: User should see an error message containing "Username is required"
    logger.info("THEN: Verifying error message appears");

    // Wait for error message to appear and verify it's displayed
    await browser.waitUntil(
      async () => {
        return await LoginPage.isErrorMessageDisplayed();
      },
      {
        timeout: 5000,
        timeoutMsg: "Error message did not appear within 5 seconds",
      }
    );

    expect(await LoginPage.isErrorMessageDisplayed()).toBe(true);

    const errorMessage = await LoginPage.getErrorMessage();
    logger.info(`Error message displayed: ${errorMessage}`);

    // Assert error message contains the expected text (SauceDemo prepends "Epic sadface: ")
    expect(errorMessage).toMatch(/Username is required/i);

    // Additional assertion to ensure error message is not empty
    expect(errorMessage.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    logger.info("UC-1 test completed");
  });
});

