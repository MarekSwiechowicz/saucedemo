/**
 * Button Component
 * Handles button click operations with retry logic
 */
const BaseElement = require("../elements/BaseElement");
const logger = require("../../utils/Logger");

class Button extends BaseElement {
  constructor(selector, name) {
    super(selector, name);
  }

  /**
   * Click the button
   */
  async click() {
    try {
      await this.waitForDisplayed();
      // Ensure element exists and is found
      const elements = await $$(this.selector);
      if (elements.length === 0) {
        throw new Error(`Element ${this.name} not found`);
      }
      const element = elements[0];
      await element.click();
    } catch (e) {
      // Retry once if click fails
      logger.info(`${this.name} click failed, retrying...`);
      try {
        await this.waitForDisplayed();
        // Ensure element exists and is found
        const elements = await $$(this.selector);
        if (elements.length === 0) {
          throw new Error(`Element ${this.name} not found`);
        }
        const element = elements[0];
        await element.click();
      } catch (retryError) {
        logger.error(`Failed to click ${this.name}: ${retryError.message}`);
        throw retryError;
      }
    }
  }
}

module.exports = Button;

