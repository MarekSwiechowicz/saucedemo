const logger = require("../utils/Logger");
const FormField = require("./components/FormField");
const Button = require("./components/Button");
const ErrorMessage = require("./components/ErrorMessage");
const BaseElement = require("./elements/BaseElement");

class LoginPage {
  constructor() {
    this.url = "https://www.saucedemo.com/";

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
    logger.info("Opening login page");
    await browser.url(this.url);
    await this.usernameField.waitForDisplayed();
  }

  async enterUsername(username) {
    await this.usernameField.setValue(username);
  }

  async enterPassword(password) {
    await this.passwordField.setValue(password);
  }

  async clearUsername() {
    await this.usernameField.clear();
  }

  async clearPassword() {
    await this.passwordField.clear();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async isLoginSuccessful() {
    const url = await browser.getUrl();
    return url.includes("/inventory");
  }

  async getErrorMessage() {
    return this.errorMessage.getText();
  }

  async isErrorMessageDisplayed() {
    return this.errorMessage.isDisplayed();
  }
  async isLoginSuccessful() {
    const url = await browser.getUrl();
    return url.includes("/inventory");
  }
  
  async getPageTitle() {
    return browser.getTitle();
  }
}


module.exports = new LoginPage();
