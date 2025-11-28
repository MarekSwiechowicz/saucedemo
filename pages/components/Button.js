const BaseElement = require("../elements/BaseElement");
const logger = require("../../utils/Logger");
const { browser } = require("@wdio/globals");

class Button extends BaseElement {
  constructor(selector, name) {
    super(selector, name);
  }

  async click(useJavaScriptClick = false) {
    try {
      await this.waitForClickable();
      if (useJavaScriptClick) {
        logger.info(`Using JavaScript click for ${this.name}`);
        await browser.execute("arguments[0].click();", await this.element);
      } else {
        await this.element.click();
      }
    } catch (e) {
      logger.info(`${this.name} click failed, retrying...`);
      try {
        await this.waitForClickable();
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
