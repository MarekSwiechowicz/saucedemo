const path = require("path");

exports.config = {
  runner: "local",

  specs: ["./features/**/*.feature"],

  maxInstances: 2,
  maxInstancesPerCapability: 1,
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: [
          "--headless",
          "--window-size=1920,1080",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-software-rasterizer",
          "--disable-extensions",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-features=TranslateUI",
          "--disable-ipc-flooding-protection",
        ],
      },
    },
    {
      browserName: "firefox",
      "moz:firefoxOptions": {
        args: ["--headless"],
      },
    },
  ],

  framework: "cucumber",

  cucumberOpts: {
    require: ["./features/step-definitions/**/*.js"],
    requireModule: ["@babel/register"],
    timeout: 90000,
    strict: false,
    format: ["message"],
    dryRun: false,
    failFast: false,
  },

  services: [
    [
      "chromedriver",
      {
        logPath: "./logs",
        args: ["--silent"],
      },
    ],
    [
      "geckodriver",
      {
        logPath: "./logs",
      },
    ],
  ],

  logLevel: "debug",

  reporters: [
    [
      "spec",
      {
        showPreface: false,
      },
    ],
  ],

  before: function (capabilities, specs) {
    browser.setTimeout({
      implicit: 10000,
      pageLoad: 30000,
      script: 30000,
    });
  },

  afterTest: function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    if (!passed) {
      console.error("Test failed with error:", error);
      browser.takeScreenshot();
    }
  },
};
