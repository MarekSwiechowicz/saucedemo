// Mocha configuration file (backup/alternative)
// This is the original Mocha-based configuration
// Use this if Cucumber BDD has compatibility issues

exports.config = {
    runner: 'local',
    
    // Test specs - Mocha tests
    specs: [
        './test/specs/**/*.js'
    ],
    
    // Capabilities for parallel execution
    maxInstances: 2,
    maxInstancesPerCapability: 1,
    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: [
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
    
    // Test framework - Mocha
    framework: 'mocha',
    
    // Mocha options
    mochaOpts: {
        ui: 'bdd',
        timeout: 90000
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
        browser.setTimeout({ 
            implicit: 10000,
            pageLoad: 30000,
            script: 30000
        });
    },
    
    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            browser.takeScreenshot();
        }
    }
};

