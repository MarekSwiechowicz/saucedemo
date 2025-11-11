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
    const input = await this.usernameInput;
    await input.setValue(username);
  }

  async enterPassword(password) {
    const input = await this.passwordInput;
    await input.setValue(password);
  }

  async clearUsername() {
    const input = await this.usernameInput;
    await input.click();
    // Select all and delete
    await browser.keys(['Control', 'a']);
    await browser.keys('Delete');
    // Also use clearValue
    await input.clearValue();
    // Force clear using JavaScript
    await browser.execute(() => {
      const element = document.querySelector(`#user-name`);
      if (element) {
        element.focus();
        element.select();
        element.value = '';
        // Trigger events
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
      }
    });
    // Small wait to ensure clearing is complete
    await browser.pause(100);
  }

  async clearPassword() {
    const input = await this.passwordInput;
    await input.click();
    // Select all and delete
    await browser.keys(['Control', 'a']);
    await browser.keys('Delete');
    // Also use clearValue
    await input.clearValue();
    // Force clear using JavaScript
    await browser.execute(() => {
      const element = document.querySelector(`#password`);
      if (element) {
        element.focus();
        element.select();
        element.value = '';
        // Trigger events
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
      }
    });
    // Small wait to ensure clearing is complete
    await browser.pause(100);
  }

  async clickLogin() {
    const button = await this.loginButton;
    await button.click();
  }

  async getErrorMessage() {
    const error = await this.errorMessage;
    return await error.getText();
  }

  async getPageTitle() {
    const title = await this.pageTitle;
    return await title.getText();
  }

  async getBrowserTitle() {
    return await browser.getTitle();
  }

  async getSwagLabsHeader() {
    const header = await $(".app_logo");
    return await header.getText();
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
