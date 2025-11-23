class BaseElement {
  constructor(selector, name) {
    this.selector = selector;
    this.name = name || selector;
  }

  get element() {
    return $(this.selector);
  }

  async waitForExist(timeout = 5000) {
    try {
      await this.element.waitForExist({ timeout });
    } catch (e) {
      throw new Error(
        `Element "${this.name}" (${this.selector}) does not exist in DOM within ${timeout}ms`
      );
    }
  }

  async waitForDisplayed(timeout = 5000) {
    try {
      await this.element.waitForDisplayed({ timeout });
    } catch (e) {
      throw new Error(
        `Element "${this.name}" (${this.selector}) not displayed within ${timeout}ms`
      );
    }
  }

  async waitForClickable(timeout = 5000) {
    try {
      await this.element.waitForClickable({ timeout });
    } catch (e) {
      throw new Error(
        `Element "${this.name}" (${this.selector}) not clickable within ${timeout}ms`
      );
    }
  }

  async waitForReady(timeout = 5000) {
    await this.waitForExist(timeout);
    await this.waitForDisplayed(timeout);
  }

  async isDisplayed() {
    try {
      await this.element.waitForDisplayed({ timeout: 2000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async isExist() {
    try {
      await this.element.waitForExist({ timeout: 2000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async isClickable() {
    try {
      await this.element.waitForClickable({ timeout: 2000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async click(skipWait = false) {
    if (!skipWait) {
      await this.waitForDisplayed();
    }
    await this.element.click();
  }

  async getText(skipWait = false) {
    if (!skipWait) {
      await this.waitForDisplayed();
    }
    return await this.element.getText();
  }

  async setValue(value, skipWait = false) {
    if (!skipWait) {
      await this.waitForDisplayed();
    }
    await this.element.setValue(value);
  }

  async clear(skipWait = false) {
    if (!skipWait) {
      await this.waitForDisplayed();
    }
    await this.element.clear();
  }
}

module.exports = BaseElement;
