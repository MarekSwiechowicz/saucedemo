class BaseElement {
  constructor(selector, name) {
    this.selector = selector;
    this.name = name || selector;
  }

  get element() {
    return $(this.selector);
  }

  async waitForDisplayed(timeout = 5000) {
    await this.element.waitForDisplayed({ timeout });
  }

  async isDisplayed() {
    try {
      await this.element.waitForDisplayed({ timeout: 2000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  async click() {
    await this.waitForDisplayed();
    await this.element.click();
  }

  async getText() {
    await this.waitForDisplayed();
    return await this.element.getText();
  }

  async setValue(value) {
    await this.waitForDisplayed();
    await this.element.setValue(value);
  }

  async clear() {
    await this.waitForDisplayed();
    await this.element.clear();
  }
}

module.exports = BaseElement;
