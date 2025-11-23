const logger = require("../utils/Logger");
const FormField = require("./components/FormField");
const Button = require("./components/Button");
const ErrorMessage = require("./components/ErrorMessage");
const BaseElement = require("./elements/BaseElement");

class LoginPage {
  get url() {
    return "https://www.saucedemo.com/";
  }

  constructor() {
    this.usernameField = new FormField("#user-name", "Username");
    this.passwordField = new FormField("#password", "Password");
    this.loginButton = new Button("#login-button", "Login Button");
    this.errorMessage = new ErrorMessage(
      ".error-message-container",
      ".error-message-container h3",
      "Error Message"
    );
    this.pageTitle = new BaseElement(".app_logo", "Page Title");
  }

  async open() {
    try {
      const currentUrl = await browser.getUrl();
      const isOnLoginPage =
        currentUrl.includes("saucedemo.com") &&
        (currentUrl.endsWith("/") || currentUrl.includes("/index.html"));

      if (isOnLoginPage) {
        logger.info("Already on login page, skipping navigation");
        return;
      }

      logger.info("Navigating to login page");
      await browser.url(this.url);
    } catch (e) {
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

  async enterUsername(username) {
    await this.usernameField.enterValue(username);
  }

  async enterPassword(password) {
    await this.passwordField.enterValue(password);
  }

  async clearUsername() {
    await this.usernameField.clearField();
  }

  async clearPassword() {
    await this.passwordField.clearField();
  }

  async clickLogin(useJavaScriptClick = false) {
    await this.loginButton.click(useJavaScriptClick);
  }

  async getErrorMessage() {
    return await this.errorMessage.getText();
  }

  async isErrorMessageDisplayed() {
    return await this.errorMessage.isDisplayed();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async isLoginSuccessful() {
    try {
      await browser.waitUntil(
        async () => {
          try {
            const url = await browser.getUrl();
            return url.includes("/inventory") || url.includes("inventory.html");
          } catch (e) {
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

      try {
        const browserTitle = await browser.getTitle();
        return browserTitle === "Swag Labs";
      } catch (e) {
        if (
          e.message &&
          (e.message.includes("session") || e.message.includes("disconnected"))
        ) {
          return false;
        }
        throw e;
      }
    } catch (e) {
      if (
        e.message &&
        (e.message.includes("session") || e.message.includes("disconnected"))
      ) {
        return false;
      }
      return false;
    }
  }

  async getPageTitle() {
    return await browser.getTitle();
  }
}

module.exports = new LoginPage();
