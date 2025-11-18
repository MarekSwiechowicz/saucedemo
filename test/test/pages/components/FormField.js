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
    try {
      await this.waitForDisplayed();
      await this.setValue(value);
    } catch (e) {
      // Handle session disconnection - retry once
      if (
        e.message &&
        (e.message.includes("session") || e.message.includes("invalid"))
      ) {
        logger.info(`Session lost during ${this.name} entry, retrying...`);
        await browser.pause(2000);
        await this.waitForDisplayed();
        await this.setValue(value);
      } else {
        logger.error(`Failed to enter value in ${this.name}: ${e.message}`);
        throw e;
      }
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

