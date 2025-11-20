exports.config = {
  runner: "local",

  // Test specs - Mocha BDD style
  specs: ["./specs/**/*.test.js"],

  // Capabilities for Firefox only
  maxInstances: 1, // Run 1 instance for Firefox
  maxInstancesPerCapability: 1,
  capabilities: [
    {
      browserName: "firefox",
      "moz:firefoxOptions": {
        args: ["--headless"],
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

  // Services - Firefox only
  services: [
    [
      "geckodriver",
      {
        logPath: "./logs",
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

