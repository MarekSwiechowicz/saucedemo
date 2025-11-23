const BaseElement = require("../elements/BaseElement");
const logger = require("../../utils/Logger");

class ErrorMessage extends BaseElement {
  constructor(containerSelector, textSelector, name = "Error Message") {
    super(containerSelector, name);
    this.textSelector = textSelector;
  }

  async getText() {
    try {
      await this.waitForDisplayed();
      if (this.textSelector) {
        try {
          const textElement = $(this.textSelector);
          const text = await textElement.getText();
          if (text && typeof text === "string" && text.length > 0) {
            return text;
          }
        } catch (e) {
          logger.info(
            "Could not get error text from specific selector, using container"
          );
        }
      }
      const containerText = await this.element.getText();
      return typeof containerText === "string"
        ? containerText
        : String(containerText || "");
    } catch (e) {
      logger.error(`Failed to get error message: ${e.message}`);
      throw e;
    }
  }

  async isDisplayed() {
    try {
      await this.element.waitForDisplayed({
        timeout: 2000,
        reverse: false,
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = ErrorMessage;
