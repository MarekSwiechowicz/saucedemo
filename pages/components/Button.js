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
   * @param {boolean} useJavaScriptClick - Use JavaScript click instead of regular click
   */
  async click(useJavaScriptClick = false) {
    try {
      await this.waitForDisplayed();
      if (useJavaScriptClick) {
        logger.info(`Using JavaScript click for ${this.name}`);
        await browser.execute("arguments[0].click();", await this.element);
      } else {
        await this.element.click();
      }
    } catch (e) {
      // Retry once if click fails
      logger.info(`${this.name} click failed, retrying...`);
      try {
        await this.waitForDisplayed();
        if (useJavaScriptClick) {
          await browser.execute("arguments[0].click();", await this.element);
        } else {
          await this.element.click();
        }
      } catch (retryError) {
        logger.error(`Failed to click ${this.name}: ${retryError.message}`);
        throw retryError;
      }
    }
  }
}

module.exports = Button;

