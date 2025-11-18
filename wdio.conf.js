exports.config = {
  runner: "local",

  specs: ["./test/test/specs/**/*.test.js"], // Run all test files

  exclude: [],

  maxInstances: 2,

  capabilities: [
    {
      maxInstances: 1,
      browserName: "chrome",
      // Use devtools protocol (Puppeteer) instead of WebDriver protocol
      // This works with Chrome 142 without requiring ChromeDriver 142 (which needs Node 20+)
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

  services: ["geckodriver"], // Chrome uses devtools protocol, doesn't need chromedriver service

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
