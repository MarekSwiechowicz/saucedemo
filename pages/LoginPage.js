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
    } catch (e) {
      // If session is lost, try to reload and retry
      if (
        e.message &&
        (e.message.includes("session") || e.message.includes("invalid"))
      ) {
        logger.info("Session lost during navigation, reloading session...");
        await browser.reloadSession();
        await browser.url(this.url);
      } else {
        throw e;
      }
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
   * @param {boolean} useJavaScriptClick - Use JavaScript click instead of regular click (for performance_glitch_user)
   */
  async clickLogin(useJavaScriptClick = false) {
    await this.loginButton.click(useJavaScriptClick);
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
   * @returns {Promise<boolean>} True if "Swag Labs" title is displayed
   */
  async isLoginSuccessful() {
    // Wait for navigation to complete
    try {
      await browser.waitUntil(
        async () => {
          try {
            const url = await browser.getUrl();
            return url.includes("/inventory") || url.includes("inventory.html");
          } catch (e) {
            // If browser disconnected, return false
            if (
              e.message &&
              (e.message.includes("session") ||
                e.message.includes("disconnected"))
            ) {
              return false;
            }
            return false;
          }
        },
        {
          timeout: 20000,
          timeoutMsg: "Failed to navigate to inventory page",
          interval: 1000,
        }
      );

      // Check browser title with error handling
      try {
        const browserTitle = await browser.getTitle();
        return browserTitle === "Swag Labs";
      } catch (e) {
        // If browser disconnected, return false
        if (
          e.message &&
          (e.message.includes("session") || e.message.includes("disconnected"))
        ) {
          return false;
        }
        throw e;
      }
    } catch (e) {
      // Handle browser disconnection gracefully
      if (
        e.message &&
        (e.message.includes("session") || e.message.includes("disconnected"))
      ) {
        return false;
      }
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
