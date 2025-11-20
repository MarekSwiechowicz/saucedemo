class BaseElement {
  constructor(selector, name) {
    this.selector = selector;
    this.name = name || selector;
  }

  get element() {
    return $(this.selector);
  }

  async waitForDisplayed(timeout = 10000) {
    await this.element.waitForDisplayed({
      timeout,
      timeoutMsg: `Element ${this.name} not displayed within ${timeout}ms`
    });
  }

  async isDisplayed() {
    try {
      return await this.element.isDisplayed();
    } catch {
      return false;
    }
  }

  async click() {
    await this.waitForDisplayed();
    await this.element.click();
  }

  async getText() {
    await this.waitForDisplayed();
    return this.element.getText();
  }

  async setValue(value) {
    await this.waitForDisplayed();
    await this.element.setValue(value);
  }

  async clear() {
    await this.waitForDisplayed();
    await this.element.clearValue();
  }
}

module.exports = BaseElement;
