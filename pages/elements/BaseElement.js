/**
 * Base Element Class
 * Wraps WebDriverIO elements with common functionality
 */
class BaseElement {
  constructor(selector, name) {
    this.selector = selector;
    this.name = name || selector;
  }

  /**
   * Get the element
   */
  get element() {
    return $(this.selector);
  }

  /**
   * Wait for element to be displayed
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForDisplayed(timeout = 5000) {
    await this.element.waitForDisplayed({ timeout });
  }

  /**
   * Check if element is displayed
   * @returns {Promise<boolean>}
   */
  async isDisplayed() {
    try {
      await this.element.waitForDisplayed({ timeout: 2000 });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Click the element
   */
  async click() {
    await this.waitForDisplayed();
    await this.element.click();
  }

  /**
   * Get element text
   * @returns {Promise<string>}
   */
  async getText() {
    await this.waitForDisplayed();
    return await this.element.getText();
  }

  /**
   * Set value in element
   * @param {string} value - Value to set
   */
  async setValue(value) {
    await this.waitForDisplayed();
    await this.element.setValue(value);
  }

  /**
   * Clear element value
   */
  async clear() {
    await this.waitForDisplayed();
    await this.element.clear();
  }
}

module.exports = BaseElement;

