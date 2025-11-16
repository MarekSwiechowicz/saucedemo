exports.config = {
    runner: 'local',
    
    // Test specs
    specs: [
        './test/specs/**/*.js'
    ],
    
    // Capabilities for parallel execution
    maxInstances: 2, // Run 2 instances in parallel (one per browser)
    maxInstancesPerCapability: 1, // Limit to 1 instance per capability to reduce resource contention
    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: [
                    // Removed --headless to run in visible mode for better stability
                    '--window-size=1920,1080',
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-software-rasterizer',
                    '--disable-extensions',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-features=TranslateUI',
                    '--disable-ipc-flooding-protection'
                ]
            }
        },
        {
            browserName: 'firefox',
            'moz:firefoxOptions': {
                args: ['--headless']
            }
        }
    ],
    
    // Test framework
    framework: 'mocha',
    
    // Mocha options
    mochaOpts: {
        ui: 'bdd',
        timeout: 90000  // Increased timeout for performance_glitch_user
    },
    
    // Services
    services: [
        ['chromedriver', {
            logPath: './logs',
            args: ['--silent']
        }],
        ['geckodriver', {
            logPath: './logs'
        }]
    ],
    
    // Logging
    logLevel: 'info',
    
    // Reporters
    reporters: ['spec'],
    
    // Hooks
    before: function (capabilities, specs) {
        // Set implicit wait
        browser.setTimeout({ 
            implicit: 10000,
            pageLoad: 30000,
            script: 30000
        });
    },
    
    // Removed beforeTest navigation - tests handle their own navigation
    
    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        // Take screenshot on failure
        if (!passed) {
            browser.takeScreenshot();
        }
    }
};

