/**
 * Form Field Component
 * Handles input field operations with enhanced clearing
 */
const BaseElement = require("../elements/BaseElement");
const logger = require("../../utils/Logger");

class FormField extends BaseElement {
  constructor(selector, name) {
    super(selector, name);
  }

  /**
   * Enter value in the field
   * @param {string} value - Value to enter
   */
  async enterValue(value) {
    await this.waitForDisplayed();
    
    // Get the element
    const elements = await $$(this.selector);
    if (elements.length === 0) {
      throw new Error(`Element ${this.name} not found`);
    }
    const element = elements[0];
    
    // Try WebDriver setValue first
    await element.setValue(value);
    
    // Immediately verify and set via JavaScript as backup
    // This ensures values persist even if WebDriver setValue doesn't work properly
    await browser.pause(100);
    const actualValue = await browser.execute((selector, expectedValue) => {
      const field = document.querySelector(selector);
      if (field) {
        const currentValue = field.value;
        if (currentValue !== expectedValue) {
          // Set via JavaScript
          field.value = expectedValue;
          field.setAttribute('value', expectedValue);
          // Trigger events
          field.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
          field.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
          return expectedValue;
        }
        return currentValue;
      }
      return '';
    }, this.selector, value);
    
    // If still not set, try one more time with focus
    if (actualValue !== value) {
      await element.click();
      await browser.pause(50);
      await element.setValue(value);
      await browser.pause(100);
    }
  }

  /**
   * Clear field completely (Chrome compatibility)
   */
  async clearField() {
    try {
      await this.waitForDisplayed();
      // Ensure element exists and is found
      const elements = await $$(this.selector);
      if (elements.length === 0) {
        throw new Error(`Element ${this.name} not found`);
      }
      const element = elements[0];
      // Click to focus, select all, and delete for Chrome compatibility
      await element.click();
      await browser.keys(["Control", "a"]);
      await browser.keys("Delete");
      // Also use JavaScript to ensure it's truly empty
      await browser.execute("arguments[0].value = '';", element);
      // Trigger input event to ensure browser recognizes the change
      await browser.execute(
        "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
        element
      );
    } catch (e) {
      logger.error(`Failed to clear ${this.name} field: ${e.message}`);
      throw e;
    }
  }
}

module.exports = FormField;

