const BaseElement = require("../elements/BaseElement");
const logger = require("../../utils/Logger");
const { browser } = require("@wdio/globals");

class FormField extends BaseElement {
  constructor(selector, name) {
    super(selector, name);
  }

  async enterValue(value) {
    try {
      await this.waitForDisplayed();
      await this.setValue(value, true);
    } catch (e) {
      if (
        e.message &&
        (e.message.includes("session") || e.message.includes("invalid"))
      ) {
        logger.info(`Session lost during ${this.name} entry, retrying...`);
        await browser.pause(2000);
        await this.waitForDisplayed();
        await this.setValue(value, true);
      } else {
        logger.error(`Failed to enter value in ${this.name}: ${e.message}`);
        throw e;
      }
    }
  }

  async clearField() {
    try {
      await this.waitForDisplayed();
      await this.element.click();
      await browser.keys(["Control", "a"]);
      await browser.keys("Delete");
      await browser.execute("arguments[0].value = '';", await this.element);
      await browser.execute(
        "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
        await this.element
      );
    } catch (e) {
      logger.error(`Failed to clear ${this.name} field: ${e.message}`);
      throw e;
    }
  }
}

module.exports = FormField;
