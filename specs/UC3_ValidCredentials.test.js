/**
 * UC-3: Login Form - Valid Credentials (BDD)
 *
 * Feature: Login Form - Successful Login
 * Scenario Outline: Successful login with valid credentials
 */

const LoginPage = require("../pages/LoginPage");
const DataProvider = require("../utils/DataProvider");
const logger = require("../utils/Logger");

describe("Feature: Login Form - Valid Credentials", () => {
  const testDataArray = DataProvider.getLoginTestData();

  testDataArray.forEach((testData) => {
    describe(`Scenario: ${testData.testName}`, () => {
      
      beforeEach(async () => {
        logger.info(`GIVEN: User is on the SauceDemo login page (${testData.testName})`);

        // Reset timeouts for all scenarios
        await browser.setTimeout({
          implicit: 0,
          pageLoad: 20000,
          script: 20000,
        });

        await LoginPage.open();
      });

      it('should successfully login and display "Swag Labs" title', async () => {
        DataProvider.logTestData("UC-3", testData);

        logger.info(`GIVEN: Username is set to "${testData.username}"`);
        await LoginPage.enterUsername(testData.username);

        logger.info("GIVEN: Password is set");
        await LoginPage.enterPassword(testData.password);

        logger.info("WHEN: Login button is clicked");
        await LoginPage.clickLogin();

        // Special delay logic only for performance_glitch_user
        const waitTimeout = testData.username === "performance_glitch_user" ? 30000 : 7000;

        logger.info("THEN: Waiting for login to complete");

        await browser.waitUntil(
          async () => {
            return await LoginPage.isLoginSuccessful();
          },
          {
            timeout: waitTimeout,
            interval: 250,
            timeoutMsg: 'Login failed — "Swag Labs" title not found in time',
          }
        );

        expect(await LoginPage.isLoginSuccessful()).toBe(true);

        logger.info('AND: Checking that page title equals "Swag Labs"');
        const title = await LoginPage.getPageTitle();
        expect(title).toBe("Swag Labs");

        logger.info("AND: Checking that user is on inventory page");
        const url = await browser.getUrl();
        expect(url).toContain("/inventory.html");

        logger.info(`Successfully navigated to inventory: ${url}`);
      });

      afterEach(() => {
        logger.info(`UC-3 completed: ${testData.testName}`);
      });
    });
  });
});
