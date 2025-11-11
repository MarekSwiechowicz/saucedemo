class LoginPage {
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
    return $('h3[data-test="error"]');
  }

  get pageTitle() {
    return $(".title");
  }

  async open() {
    await browser.url("/");
  }

  async enterUsername(username) {
    await this.usernameInput.setValue(username);
  }

  async enterPassword(password) {
    await this.passwordInput.setValue(password);
  }

  async clearUsername() {
    const input = await this.usernameInput;
    await input.doubleClick();
    await browser.keys("Delete");
    await input.setValue("");
  }

  async clearPassword() {
    const input = await this.passwordInput;
    await input.doubleClick();
    await browser.keys("Delete");
    await input.setValue("");
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.getText();
  }

  async getPageTitle() {
    return await this.pageTitle.getText();
  }

  async getBrowserTitle() {
    return await browser.getTitle();
  }

  async getSwagLabsHeader() {
    return await $(".app_logo").getText();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}

module.exports = new LoginPage();
