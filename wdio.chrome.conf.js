exports.config = {
  runner: "local",

  // Test specs - Mocha BDD style
  specs: ["./specs/**/*.test.js"],

  // Capabilities for Chrome only
  maxInstances: 1, // Run 1 instance for Chrome
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
  ],

  // Test framework - Mocha with BDD interface
  framework: "mocha",

  // Mocha options
  mochaOpts: {
    ui: "bdd", // Use BDD interface (describe/it)
    require: [require.resolve("@babel/register")],
    timeout: 180000, // Increased timeout for performance_glitch_user (3 minutes)
  },

  // Services - Chrome only
  services: [
    [
      "chromedriver",
      {
        logPath: "./logs",
        args: ["--silent"],
      },
    ],
  ],

  // Logging
  logLevel: "info",

  // Reporters
  reporters: ["spec"],

  // Hooks
  before: function (capabilities, specs) {
    // Set implicit wait
    browser.setTimeout({
      implicit: 10000,
      pageLoad: 30000,
      script: 30000,
    });
  },

  // Removed beforeTest navigation - tests handle their own navigation

  afterTest: function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    // Take screenshot on failure
    if (!passed) {
      browser.takeScreenshot();
    }
  },
};

