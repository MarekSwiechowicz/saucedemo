/**
 * UC-3: Login Form - Valid Credentials (BDD)
 *
 * Feature: Login Form - Successful Login
 * Scenario: Successful login with standard user
 */

const LoginPage = require("../pages/LoginPage");
const logger = require("../utils/Logger");

describe("Feature: Login Form - Valid Credentials", () => {

  beforeEach(async () => {
    logger.info("Given user is on the login page");

    await browser.setTimeout({
      implicit: 0,
      pageLoad: 20000,
      script: 20000
    });

    await LoginPage.open();
  });

  describe("Scenario: Valid Standard User", () => {

    it('should successfully login and display "Swag Labs" title', async () => {

      logger.info('Given username "standard_user" is entered');
      await LoginPage.enterUsername("standard_user");

      logger.info("And password is entered");
      await LoginPage.enterPassword("secret_sauce");

      logger.info("When login button is clicked");
      await LoginPage.clickLogin();

      logger.info("Then login should complete successfully");
      await browser.waitUntil(
        async () => await LoginPage.isLoginSuccessful(),
        {
          timeout: 15000,
          interval: 300,
          timeoutMsg: 'Login failed — inventory page not loaded'
        }
      );

      expect(await LoginPage.isLoginSuccessful()).toBe(true);

      logger.info('And page title should be "Swag Labs"');
      const title = await LoginPage.getPageTitle();
      expect(title).toBe("Swag Labs");

      logger.info("And current URL should contain /inventory");
      const url = await browser.getUrl();
      expect(url).toContain("/inventory");

      logger.info(`Scenario passed: User was redirected to ${url}`);
    });
  });

  afterEach(() => {
    logger.info("Scenario completed");
  });
});
