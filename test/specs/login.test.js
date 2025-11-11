const LoginPage = require("../pages/LoginPage");
const loginData = require("../data/loginData");

describe("SauceDemo Login Tests", () => {
  beforeEach(async function () {
    const testTitle =
      this.currentTest && this.currentTest.title
        ? this.currentTest.title
        : "Unknown";
    console.log(`[${new Date().toISOString()}] Starting test: ${testTitle}`);
    await LoginPage.open();
  });

  afterEach(async function () {
    const testTitle =
      this.currentTest && this.currentTest.title
        ? this.currentTest.title
        : "Unknown";
    console.log(`[${new Date().toISOString()}] Completed test: ${testTitle}`);
  });

  describe("UC-1: Test Login form with empty credentials", () => {
    it('should display "Username is required" error when both fields are cleared', async () => {
      // BDD Structure: Given-When-Then
      // GIVEN: User is on the login page with credentials entered
      console.log(
        "[UC-1] GIVEN: Entering credentials in username and password fields"
      );
      await LoginPage.enterUsername(loginData.testData.anyUsername);
      await LoginPage.enterPassword(loginData.testData.anyPassword);

      // WHEN: User clears both input fields and clicks Login
      console.log("[UC-1] WHEN: Clearing both input fields");
      await LoginPage.clearUsername();
      await LoginPage.clearPassword();

      console.log("[UC-1] WHEN: Clicking Login button");
      await LoginPage.clickLogin();

      // THEN: Error message "Username is required" should be displayed
      console.log("[UC-1] THEN: Verifying error message");
      const errorMessage = await LoginPage.getErrorMessage();
      // Complete assertion with proper error handling
      expect(errorMessage).toBe("Epic sadface: Username is required");

      console.log("[UC-1] Test passed: Error message displayed correctly");
    });
  });

  describe("UC-2: Test Login form with credentials by passing Username", () => {
    it('should display "Password is required" error when password is cleared', async () => {
      // BDD Structure: Given-When-Then
      // GIVEN: User is on the login page with username entered
      console.log("[UC-2] GIVEN: Entering username");
      await LoginPage.enterUsername(loginData.testData.anyUsername);

      console.log("[UC-2] GIVEN: Entering password");
      await LoginPage.enterPassword(loginData.testData.anyPassword);

      // WHEN: User clears password field and clicks Login
      console.log("[UC-2] WHEN: Clearing password field");
      await LoginPage.clearPassword();

      console.log("[UC-2] WHEN: Clicking Login button");
      await LoginPage.clickLogin();

      // THEN: Error message "Password is required" should be displayed
      console.log("[UC-2] THEN: Verifying error message");
      const errorMessage = await LoginPage.getErrorMessage();
      // Complete assertion with proper error handling
      expect(errorMessage).toBe("Epic sadface: Password is required");

      console.log("[UC-2] Test passed: Error message displayed correctly");
    });
  });

  describe("UC-3: Test Login form with valid credentials", () => {
    loginData.validCredentials.forEach((credential) => {
      it(`should successfully login and display "Swag Labs" title for ${credential.description}`, async function () {
        // Increase timeout for performance_glitch_user test
        this.timeout(60000);

        // BDD Structure: Given-When-Then
        // GIVEN: User has valid credentials (from data provider)
        // WHEN: User enters valid username and password, then clicks Login
        console.log(`[UC-3] WHEN: Logging in with ${credential.username}`);
        await LoginPage.login(credential.username, credential.password);

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

        // THEN: User should be on dashboard with "Swag Labs" title displayed
        console.log(
          '[UC-3] THEN: Verifying browser title contains "Swag Labs"'
        );
        const browserTitle = await LoginPage.getBrowserTitle();
        // Complete assertion with proper error handling
        expect(browserTitle).toContain("Swag Labs");

        console.log('[UC-3] THEN: Verifying "Swag Labs" header is displayed');
        const swagLabsHeader = await LoginPage.getSwagLabsHeader();
        // Complete assertion with proper error handling
        expect(swagLabsHeader).toBe("Swag Labs");

        console.log(
          `[UC-3] Test passed: Successfully logged in as ${credential.username}`
        );
      }).retries(2); // Retry up to 2 times if test fails (Mocha retry feature)
    });
  });
});
