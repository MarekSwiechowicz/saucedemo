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
  async waitForDisplayed(timeout = 10000) {
    // Use findElements to check existence, which is more reliable with DevTools protocol
    // In WebDriverIO v6, use waitUntil with findElements and isDisplayed for better compatibility
    try {
      await browser.waitUntil(
        async () => {
          try {
            // Use findElements to check if element exists (more reliable than isExisting with DevTools)
            const elements = await $$(this.selector);
            if (elements.length === 0) {
              return false;
            }
            // Get the first element and check if it's displayed
            const element = elements[0];
            const displayed = await element.isDisplayed();
            return displayed;
          } catch (e) {
            return false;
          }
        },
        {
          timeout: timeout,
          timeoutMsg: `Element ${this.name} was not found in DOM or not displayed within ${timeout}ms`,
          interval: 100,
        }
      );
    } catch (e) {
      // Provide more specific error message
      try {
        const elements = await $$(this.selector);
        if (elements.length === 0) {
          throw new Error(
            `Element ${this.name} was not found in DOM within ${timeout}ms`
          );
        }
        const element = elements[0];
        const displayed = await element.isDisplayed();
        if (!displayed) {
          throw new Error(
            `Element ${this.name} was not displayed within ${timeout}ms`
          );
        }
        // If we get here, something else went wrong
        throw e;
      } catch (checkError) {
        throw new Error(
          `Element ${this.name} was not found in DOM within ${timeout}ms`
        );
      }
    }
  }

  /**
   * Check if element is displayed
   * @returns {Promise<boolean>}
   */
  async isDisplayed() {
    try {
      const elements = await $$(this.selector);
      if (elements.length === 0) {
        return false;
      }
      const element = elements[0];
      return await element.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  /**
   * Click the element
   */
  async click() {
    await this.waitForDisplayed();
    // Ensure element exists and is found before calling click
    const elements = await $$(this.selector);
    if (elements.length === 0) {
      throw new Error(`Element ${this.name} not found`);
    }
    const element = elements[0];
    await element.click();
  }

  /**
   * Get element text
   * @returns {Promise<string>}
   */
  async getText() {
    await this.waitForDisplayed();
    const elements = await $$(this.selector);
    if (elements.length === 0) {
      throw new Error(`Element ${this.name} not found`);
    }
    const element = elements[0];
    return await element.getText();
  }

  /**
   * Set value in element
   * @param {string} value - Value to set
   */
  async setValue(value) {
    await this.waitForDisplayed();
    // Ensure element exists and is found before calling setValue
    // Use findElements approach for better compatibility with DevTools protocol
    const elements = await $$(this.selector);
    if (elements.length === 0) {
      throw new Error(`Element ${this.name} not found`);
    }
    const element = elements[0];
    await element.setValue(value);
  }

  /**
   * Clear element value
   */
  async clear() {
    await this.waitForDisplayed();
    const elements = await $$(this.selector);
    if (elements.length === 0) {
      throw new Error(`Element ${this.name} not found`);
    }
    const element = elements[0];
    await element.clear();
  }
}

module.exports = BaseElement;

