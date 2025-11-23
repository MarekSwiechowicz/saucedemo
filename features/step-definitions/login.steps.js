const { Given, When, Then } = require("@wdio/cucumber-framework");
const LoginPage = require("../../pages/LoginPage");
const logger = require("../../utils/Logger");
const DataProvider = require("../../utils/DataProvider");
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
    const validPassword = DataProvider.getValidPassword();
    await LoginPage.enterUsername("test_user");
    await LoginPage.enterPassword(validPassword);
    DataProvider.logTestData("Temporary Credentials", {
      username: "test_user",
      password: validPassword,
    });
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
  const acceptedUsernames = DataProvider.getAcceptedUsernames();
  if (acceptedUsernames.includes(username)) {
    logger.info(`Username "${username}" is in the accepted usernames list`);
  }
  await LoginPage.enterUsername(username);
});

When("I clear the password field", async function () {
  logger.info("GIVEN: User has left the password field empty");
  await LoginPage.clearPassword();
});

When("I enter {string} in the password field", async function (password) {
  logger.info("GIVEN: User has entered a valid password in the password field");
  const validPassword = DataProvider.getValidPassword();
  if (password === validPassword) {
    logger.info("Password matches the valid password from DataProvider");
  }
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

    const emptyCredentialsData = DataProvider.getEmptyCredentialsData();
    const missingPasswordData = DataProvider.getMissingPasswordData();

    let dataProviderError = null;
    if (expectedText.toLowerCase().includes("username")) {
      dataProviderError = emptyCredentialsData.expectedError;
      DataProvider.logTestData(
        emptyCredentialsData.testName,
        emptyCredentialsData
      );
    } else if (expectedText.toLowerCase().includes("password")) {
      const matchingData = missingPasswordData.find((data) =>
        data.expectedError.toLowerCase().includes(expectedText.toLowerCase())
      );
      if (matchingData) {
        dataProviderError = matchingData.expectedError;
        DataProvider.logTestData(matchingData.testName, matchingData);
      }
    }

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

    if (dataProviderError) {
      expect(errorMessage).toMatch(new RegExp(dataProviderError, "i"));
    }
  }
);

Then("I should be successfully logged in", async function () {
  logger.info("THEN: Verifying successful login");

  const loginTestData = DataProvider.getLoginTestData();
  if (loginTestData && loginTestData.length > 0) {
    DataProvider.logTestData(loginTestData[0].testName, loginTestData[0]);
  }

  const isSuccessful = await LoginPage.isLoginSuccessful();
  expect(isSuccessful).toBe(true);
});

Then("I should see the page title {string}", async function (expectedTitle) {
  logger.info(`AND: Verifying page title "${expectedTitle}" is displayed`);

  const loginTestData = DataProvider.getLoginTestData();
  if (
    loginTestData &&
    loginTestData.length > 0 &&
    loginTestData[0].expectedResult === "success"
  ) {
    logger.info("Validating against DataProvider login test data");
  }

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
