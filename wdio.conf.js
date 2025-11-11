exports.config = {
  runner: "local",

  specs: ["./test/specs/**/*.js"],

  exclude: [],

  maxInstances: 2,

  capabilities: [
    {
      maxInstances: 1,
      browserName: "chrome",
      "goog:chromeOptions": {
        args: [
          "--headless",
          "--disable-gpu",
          "--window-size=1920,1080",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-software-rasterizer",
        ],
      },
    },
    {
      maxInstances: 1,
      browserName: "firefox",
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

  services: ["chromedriver", "geckodriver"],

  framework: "mocha",

  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 90000, // Increased timeout for stability
  },

  before: function (capabilities, specs) {
    console.log("Starting test execution...");
  },

  after: function (result, capabilities, specs) {
    console.log("Test execution completed.");
  },
};
