/**
 * Login Page (Physical Page)
 * Uses Page Components and Elements to interact with the SauceDemo login page
 */
const logger = require("../utils/Logger");
const FormField = require("./components/FormField");
const Button = require("./components/Button");
const ErrorMessage = require("./components/ErrorMessage");
const BaseElement = require("./elements/BaseElement");

class LoginPage {
  // Page URL
  get url() {
    return "https://www.saucedemo.com/";
  }

  // Page Components
  constructor() {
    // Form Fields
    this.usernameField = new FormField("#user-name", "Username");
    this.passwordField = new FormField("#password", "Password");

    // Buttons
    this.loginButton = new Button("#login-button", "Login Button");

    // Error Message Component
    this.errorMessage = new ErrorMessage(
      ".error-message-container",
      ".error-message-container h3",
      "Error Message"
    );

    // Page Elements
    this.pageTitle = new BaseElement(".app_logo", "Page Title");
  }

  /**
   * Navigate to the login page
   * Only navigates if not already on the login page to avoid unnecessary page loads
   */
  async open() {
    try {
      // Check if we're already on the login page
      const currentUrl = await browser.getUrl();
      const isOnLoginPage =
        currentUrl.includes("saucedemo.com") &&
        (currentUrl.endsWith("/") || currentUrl.includes("/index.html"));

      if (isOnLoginPage) {
        // Already on login page, skip navigation to save time
        logger.info("Already on login page, skipping navigation");
        return;
      }

      // Navigate to login page
      logger.info("Navigating to login page");
      await browser.url(this.url);

      // Wait for page to be ready - wait for username field to exist
      await browser.waitUntil(
        async () => {
          try {
            const usernameField = await $("#user-name");
            return await usernameField.isExisting();
          } catch (e) {
            return false;
          }
        },
        {
          timeout: 10000,
          timeoutMsg: "Login page did not load within 10 seconds",
        }
      );
    } catch (e) {
      throw e;
    }
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  async enterUsername(username) {
    await this.usernameField.enterValue(username);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    await this.passwordField.enterValue(password);
  }

  /**
   * Clear username field
   */
  async clearUsername() {
    await this.usernameField.clearField();
  }

  /**
   * Clear password field
   */
  async clearPassword() {
    await this.passwordField.clearField();
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    return await this.errorMessage.getText();
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error message is displayed
   */
  async isErrorMessageDisplayed() {
    return await this.errorMessage.isDisplayed();
  }

  /**
   * Perform login with credentials
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Check if login was successful by verifying page title
   * Note: This method checks the current state without waiting.
   * The caller should use waitUntil to poll this method.
   * @returns {Promise<boolean>} True if "Swag Labs" title is displayed
   */
  async isLoginSuccessful() {
    try {
      // Check URL first (faster check)
      const url = await browser.getUrl();
      const isOnInventoryPage =
        url.includes("/inventory") || url.includes("inventory.html");

      if (!isOnInventoryPage) {
        return false;
      }

      // Check browser title
      const browserTitle = await browser.getTitle();
      if (browserTitle === "Swag Labs") {
        return true;
      }

      // If title is not set yet, check for inventory elements
      // This handles cases where page loads but title takes time to update
      const inventoryElements = await $$(
        ".inventory_list, .inventory_container, #inventory_container"
      );
      return inventoryElements.length > 0;
    } catch (e) {
      // Any error means we're not logged in yet
      return false;
    }
  }

  /**
   * Get page title text
   * @returns {Promise<string>} Page title text
   */
  async getPageTitle() {
    return await browser.getTitle();
  }
}

module.exports = new LoginPage();

