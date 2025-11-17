/**
 * Error Message Component
 * Handles error message display and text retrieval
 */
const BaseElement = require("../elements/BaseElement");
const logger = require("../../utils/Logger");

class ErrorMessage extends BaseElement {
  constructor(containerSelector, textSelector, name = "Error Message") {
    super(containerSelector, name);
    this.textSelector = textSelector;
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message text
   */
  async getText() {
    try {
      await this.waitForDisplayed();
      // Try to get text from specific text selector first
      if (this.textSelector) {
        try {
          const textElement = $(this.textSelector);
          const text = await textElement.getText();
          if (text && typeof text === "string" && text.length > 0) {
            return text;
          }
        } catch (e) {
          // Fallback to container text
          logger.info("Could not get error text from specific selector, using container");
        }
      }
      // Fallback to container text
      const containerText = await this.element.getText();
      // Ensure we return a string
      return typeof containerText === "string"
        ? containerText
        : String(containerText || "");
    } catch (e) {
      logger.error(`Failed to get error message: ${e.message}`);
      throw e;
    }
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error message is displayed
   */
  async isDisplayed() {
    try {
      await this.element.waitForDisplayed({
        timeout: 2000,
        reverse: false,
      });
      return true;
    } catch (e) {
      // If element is not displayed or doesn't exist, return false
      return false;
    }
  }
}

module.exports = ErrorMessage;

