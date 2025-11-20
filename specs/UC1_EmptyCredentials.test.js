/**
 * UC-1: Login Form - Empty Credentials (BDD)
 *
 * Feature: Login Form Validation
 * Scenario: Login with empty username and password fields
 */

const LoginPage = require("../pages/LoginPage");
const DataProvider = require("../utils/DataProvider");
const logger = require("../utils/Logger");

describe("Feature: Login Form - Empty Credentials", () => {

  beforeEach(async () => {
    logger.info("GIVEN: User is on the SauceDemo login page");

    await browser.setTimeout({
      implicit: 0,
      pageLoad: 20000,
      script: 20000
    });

    await LoginPage.open();
  });

  it('should display "Username is required" error when both fields are empty', async () => {
    const testData = DataProvider.getEmptyCredentialsData();
    DataProvider.logTestData("UC-1", testData);

    logger.info("GIVEN: Both username and password fields are empty");
    // Fields already empty — nothing to clear

    logger.info("WHEN: Login button is clicked");
    await LoginPage.clickLogin();

    logger.info("THEN: Waiting for error message");

    await browser.waitUntil(
      async () => await LoginPage.isErrorMessageDisplayed(),
      {
        timeout: 5000,
        interval: 200,
        timeoutMsg: 'Expected username error but none appeared'
      }
    );

    const error = await LoginPage.getErrorMessage();
    logger.info(`Error message displayed: ${error}`);

    expect(error).toMatch(/Username is required/i);
    expect(error.trim().length).toBeGreaterThan(0);
  });

  afterEach(() => {
    logger.info("UC-1 test completed");
  });
});
