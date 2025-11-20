const { Given, When, Then } = require("@wdio/cucumber-framework");
const LoginPage = require("../../pages/LoginPage");
const logger = require("../../utils/Logger");
const { expect } = require("@wdio/globals");

Given("I am on the SauceDemo login page", async function () {
  console.log("STEP DEFINITION EXECUTED: I am on the SauceDemo login page");
  try {
    logger.info("GIVEN: User is on the SauceDemo login page");
    console.log("About to call LoginPage.open()");
    await LoginPage.open();
    console.log("LoginPage.open() completed successfully");
  } catch (error) {
    console.error("ERROR in Given step:", error);
    logger.error(`Error in Given step: ${error.message}`);
    logger.error(error.stack);
    throw error;
  }
});

When(
  "I enter temporary credentials in username and password fields",
  async function () {
    logger.info("GIVEN: User has entered temporary credentials");
    await LoginPage.enterUsername("test_user");
    await LoginPage.enterPassword("test_password");
  }
);

When("I clear both username and password fields", async function () {
  logger.info("WHEN: User clears both the username and password fields");
  await LoginPage.clearUsername();
  await LoginPage.clearPassword();
  await browser.pause(500);
});

When("I enter {string} in the username field", async function (username) {
  logger.info(`GIVEN: User has entered "${username}" in the username field`);
  await LoginPage.enterUsername(username);
});

When("I clear the password field", async function () {
  logger.info("GIVEN: User has left the password field empty");
  await LoginPage.clearPassword();
});

When("I enter {string} in the password field", async function (password) {
  logger.info("GIVEN: User has entered a valid password in the password field");
  await LoginPage.enterPassword(password);
});

When("I click the Login button", async function () {
  logger.info("WHEN: User clicks the Login button");

  const currentUsername = await browser.execute(() => {
    return document.querySelector("#user-name")?.value || "";
  });

  if (currentUsername === "performance_glitch_user") {
    logger.info("Performance glitch user detected, waiting before login...");
    await browser.pause(2000);
    await LoginPage.clickLogin(true);
  } else {
    await LoginPage.clickLogin();
  }
});

Then(
  "I should see an error message containing {string}",
  async function (expectedText) {
    logger.info("THEN: Verifying error message appears");

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

    expect(errorMessage).toMatch(new RegExp(expectedText, "i"));
    expect(errorMessage.length).toBeGreaterThan(0);
  }
);

Then("I should be successfully logged in", async function () {
  logger.info("THEN: Verifying successful login");
  const isSuccessful = await LoginPage.isLoginSuccessful();
  expect(isSuccessful).toBe(true);
});

Then("I should see the page title {string}", async function (expectedTitle) {
  logger.info(`AND: Verifying page title "${expectedTitle}" is displayed`);
  const pageTitle = await LoginPage.getPageTitle();
  logger.info(`Page title displayed: ${pageTitle}`);
  expect(pageTitle).toBe(expectedTitle);
});

Then("I should be on the inventory page", async function () {
  logger.info("AND: Verifying user is on the inventory page");
  const currentUrl = await browser.getUrl();
  logger.info(`Successfully navigated to: ${currentUrl}`);
  expect(currentUrl).toMatch(/inventory/);
});
