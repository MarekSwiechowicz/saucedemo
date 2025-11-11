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

    // Wait for navigation after login (especially important for performance_glitch_user)
    if (username === "performance_glitch_user") {
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl();
          return url.includes("/inventory.html") || url.includes("/inventory");
        },
        {
          timeout: 20000,
          timeoutMsg: "Login did not complete within 20 seconds",
        }
      );
    } else {
      // Wait for page to load for other users
      await browser.waitUntil(
        async () => {
          const url = await browser.getUrl();
          return url.includes("/inventory.html") || url.includes("/inventory");
        },
        {
          timeout: 10000,
          timeoutMsg: "Login did not complete within 10 seconds",
        }
      );
    }
  }
}

module.exports = new LoginPage();
