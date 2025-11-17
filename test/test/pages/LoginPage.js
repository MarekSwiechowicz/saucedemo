/**
 * Login Page Object Model
 * Contains all selectors and methods for the SauceDemo login page
 */
const logger = require("../utils/Logger");

class LoginPage {
  // Page URL
  get url() {
    return "https://www.saucedemo.com/";
  }

  // CSS Selectors
  get usernameInput() {
    return $("#user-name");
  }

  get passwordInput() {
    return $("#password");
  }

  get loginButton() {
    return $("#login-button");
  }

  get errorMessage() {
    return $(".error-message-container");
  }

  get errorMessageText() {
    return $(".error-message-container h3");
  }

  get pageTitle() {
    return $(".app_logo");
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
    try {
      await this.usernameInput.waitForDisplayed({ timeout: 5000 });
      await this.usernameInput.setValue(username);
    } catch (e) {
      // Handle session disconnection - retry once
      if (
        e.message &&
        (e.message.includes("session") || e.message.includes("invalid"))
      ) {
        logger.info("Session lost during username entry, retrying...");
        await browser.pause(2000);
        await this.usernameInput.waitForDisplayed({ timeout: 5000 });
        await this.usernameInput.setValue(username);
      } else {
        logger.error(`Failed to enter username: ${e.message}`);
        throw e;
      }
    }
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    try {
      await this.passwordInput.waitForDisplayed({ timeout: 5000 });
      await this.passwordInput.setValue(password);
    } catch (e) {
      // Handle session disconnection - retry once
      if (
        e.message &&
        (e.message.includes("session") || e.message.includes("invalid"))
      ) {
        logger.info("Session lost during password entry, retrying...");
        await browser.pause(2000);
        await this.passwordInput.waitForDisplayed({ timeout: 5000 });
        await this.passwordInput.setValue(password);
      } else {
        throw e;
      }
    }
  }

  /**
   * Clear username field
   * Uses multiple methods to ensure field is cleared (Chrome compatibility)
   */
  async clearUsername() {
    try {
      await this.usernameInput.waitForDisplayed({ timeout: 5000 });
      // Click to focus, select all, and delete for Chrome compatibility
      await this.usernameInput.click();
      await browser.keys(["Control", "a"]);
      await browser.keys("Delete");
      // Also use JavaScript to ensure it's truly empty
      await browser.execute(
        "arguments[0].value = '';",
        await this.usernameInput
      );
      // Trigger input event to ensure browser recognizes the change
      await browser.execute(
        "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
        await this.usernameInput
      );
    } catch (e) {
      logger.error(`Failed to clear username field: ${e.message}`);
      throw e;
    }
  }

  /**
   * Clear password field
   * Uses multiple methods to ensure field is cleared (Chrome compatibility)
   */
  async clearPassword() {
    try {
      await this.passwordInput.waitForDisplayed({ timeout: 5000 });
      // Click to focus, select all, and delete for Chrome compatibility
      await this.passwordInput.click();
      await browser.keys(["Control", "a"]);
      await browser.keys("Delete");
      // Also use JavaScript to ensure it's truly empty
      await browser.execute(
        "arguments[0].value = '';",
        await this.passwordInput
      );
      // Trigger input event to ensure browser recognizes the change
      await browser.execute(
        "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
        await this.passwordInput
      );
    } catch (e) {
      logger.error(`Failed to clear password field: ${e.message}`);
      throw e;
    }
  }

  /**
   * Click login button
   * @param {boolean} useJavaScriptClick - Use JavaScript click instead of regular click (for performance_glitch_user)
   */
  async clickLogin(useJavaScriptClick = false) {
    try {
      await this.loginButton.waitForDisplayed({ timeout: 5000 });
      if (useJavaScriptClick) {
        // Use JavaScript click for better reliability with performance_glitch_user
        logger.info("Using JavaScript click for login button");
        await browser.execute("arguments[0].click();", await this.loginButton);
      } else {
        await this.loginButton.click();
      }
    } catch (e) {
      // Retry once if click fails
      logger.info("Login button click failed, retrying...");
      try {
        await this.loginButton.waitForDisplayed({ timeout: 5000 });
        if (useJavaScriptClick) {
          await browser.execute(
            "arguments[0].click();",
            await this.loginButton
          );
        } else {
          await this.loginButton.click();
        }
      } catch (retryError) {
        logger.error(`Failed to click login button: ${retryError.message}`);
        throw retryError;
      }
    }
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    try {
      await this.errorMessage.waitForDisplayed({ timeout: 5000 });
      // Try to get text from h3 first, if not available, get from container
      try {
        const h3Text = await this.errorMessageText.getText();
        if (h3Text && typeof h3Text === "string" && h3Text.length > 0) {
          return h3Text;
        }
      } catch (e) {
        // Fallback to container text
        logger.info("Could not get error text from h3, using container");
      }
      const containerText = await this.errorMessage.getText();
      // Ensure we return a string
      return typeof containerText === "string"
        ? containerText
        : String(containerText || "");
    } catch (e) {
      logger.error(`Failed to get error message: ${e.message}`);
      throw e;
    }
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error message is displayed
   */
  async isErrorMessageDisplayed() {
    try {
      // Wait for element to be displayed with a short timeout
      await this.errorMessage.waitForDisplayed({
        timeout: 2000,
        reverse: false,
      });
      return true;
    } catch (e) {
      // If element is not displayed or doesn't exist, return false
      return false;
    }
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
    // Use browser title
    return await browser.getTitle();
  }
}

module.exports = new LoginPage();
