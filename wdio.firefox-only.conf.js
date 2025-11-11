// Firefox-only configuration for Node 12.14
// Use this config if Chrome version doesn't match ChromeDriver 87
// Run with: wdio run wdio.firefox-only.conf.js

exports.config = {
  runner: "local",

  specs: ["./test/specs/**/*.js"],

  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
      maxInstances: 1,
      browserName: "firefox",
      protocol: "webdriver",
      "moz:firefoxOptions": {
        args: ["--headless"],
      },
    },
  ],

  logLevel: "info",

  bail: 0,

  baseUrl: "https://www.saucedemo.com",

  waitforTimeout: 10000,

  connectionRetryTimeout: 120000,

  connectionRetryCount: 3,

  services: ["geckodriver"],

  framework: "mocha",

  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 90000,
  },

  before: function (capabilities, specs) {
    console.log("Starting test execution...");
  },

  after: function (result, capabilities, specs) {
    console.log("Test execution completed.");
  },
};

