/**
 * Step Definitions for Login Feature Tests
 * Maps Gherkin steps to actual test implementation
 */
const { Given, When, Then, Before, After } = require('@wdio/cucumber-framework');
const LoginPage = require('../../pages/LoginPage');
const DataProvider = require('../../utils/DataProvider');
const logger = require('../../utils/Logger');

/**
 * Background step - Navigate to login page
 */
Given('I am on the SauceDemo login page', async () => {
    logger.info('Background: Navigating to SauceDemo login page');
    try {
        await LoginPage.open();
    } catch (e) {
        // Handle session loss
        if (e.message && (e.message.includes('session') || e.message.includes('invalid'))) {
            logger.info('Session lost during page open, reloading session...');
            await browser.reloadSession();
            await browser.setTimeout({ 
                implicit: 10000,
                pageLoad: 30000,
                script: 30000
            });
            await LoginPage.open();
        } else {
            throw e;
        }
    }
});

/**
 * UC-1 Steps
 */
Given('I have entered temporary credentials in the username and password fields', async () => {
    logger.info('Step: Entering temporary credentials');
    await LoginPage.enterUsername('test_user');
    await LoginPage.enterPassword('test_password');
});

When('I clear both the username and password fields', async () => {
    logger.info('Step: Clearing both input fields');
    await LoginPage.clearUsername();
    await LoginPage.clearPassword();
    // Wait a moment after clearing to ensure fields are truly empty (especially for Chrome)
    await browser.pause(500);
});

/**
 * UC-2 and UC-3 Steps
 */
Given('I have entered {string} in the username field', async function(username) {
    logger.info(`Step: Entering username: ${username}`);
    // Store username in context for use in other steps
    this.username = username;
    
    try {
        await LoginPage.enterUsername(username);
    } catch (e) {
        // Handle session loss for performance_glitch_user
        if (username === 'performance_glitch_user' && 
            e.message && (e.message.includes('session') || e.message.includes('invalid'))) {
            logger.info('Session lost during username entry, reloading session...');
            await browser.pause(3000);
            try {
                await browser.getUrl();
                // Session is valid, retry
                await LoginPage.enterUsername(username);
            } catch (sessionError) {
                await browser.reloadSession();
                await browser.setTimeout({ 
                    implicit: 30000,
                    pageLoad: 90000,
                    script: 90000
                });
                await LoginPage.open();
                await browser.pause(5000);
                await LoginPage.enterUsername(username);
            }
        } else {
            throw e;
        }
    }
});

Given('I have left the password field empty', async () => {
    logger.info('Step: Leaving password field empty');
    // Password field is already empty, no action needed
});

/**
 * UC-3 Steps
 */
Given('I have entered a valid password in the password field', async () => {
    logger.info('Step: Entering valid password');
    const password = DataProvider.getValidPassword();
    await LoginPage.enterPassword(password);
});

/**
 * Common Steps
 */
When('I click the Login button', async function() {
    logger.info('Step: Clicking Login button');
    const username = this.username || '';
    const useJsClick = username === 'performance_glitch_user';
    
    // For performance_glitch_user, add a pause before clicking
    if (username === 'performance_glitch_user') {
        logger.info('Performance glitch user detected, waiting before login...');
        await browser.pause(1000);
    }
    
    try {
        await LoginPage.clickLogin(useJsClick);
    } catch (e) {
        // For performance_glitch_user, try one more time with a longer wait
        if (username === 'performance_glitch_user') {
            logger.info('First click attempt failed, waiting and retrying...');
            await browser.pause(3000);
            await LoginPage.clickLogin(true); // Force JS click on retry
        } else {
            throw e;
        }
    }
});

Then('I should see an error message containing {string}', async (expectedText) => {
    logger.info(`Step: Verifying error message contains: ${expectedText}`);
    
    // Wait for error message to appear
    await browser.waitUntil(async () => {
        return await LoginPage.isErrorMessageDisplayed();
    }, {
        timeout: 5000,
        timeoutMsg: 'Error message did not appear within 5 seconds'
    });
    
    expect(await LoginPage.isErrorMessageDisplayed()).toBe(true);
    
    const errorMessage = await LoginPage.getErrorMessage();
    logger.info(`Error message displayed: ${errorMessage}`);
    
    // Assert error message contains the expected text (case-insensitive)
    expect(errorMessage).toMatch(new RegExp(expectedText, 'i'));
    
    // Additional assertion to ensure error message is not empty
    expect(errorMessage.length).toBeGreaterThan(0);
});

Then('I should be successfully logged in', async function() {
    logger.info('Step: Verifying successful login');
    const username = this.username || '';
    const timeout = username === 'performance_glitch_user' ? 30000 : 10000;
    const interval = username === 'performance_glitch_user' ? 2000 : 500;
    
    await browser.waitUntil(async () => {
        try {
            return await LoginPage.isLoginSuccessful();
        } catch (e) {
            // Handle browser disconnection during wait
            if (e.message && (e.message.includes('session') || e.message.includes('disconnected'))) {
                logger.info('Browser disconnected during wait, retrying...');
                await browser.pause(2000);
                return false;
            }
            throw e;
        }
    }, {
        timeout: timeout,
        interval: interval,
        timeoutMsg: 'Login was not successful - page title "Swag Labs" did not appear'
    });
    
    expect(await LoginPage.isLoginSuccessful()).toBe(true);
});

Then('I should see the page title {string}', async (expectedTitle) => {
    logger.info(`Step: Verifying page title: ${expectedTitle}`);
    const pageTitle = await LoginPage.getPageTitle();
    logger.info(`Page title displayed: ${pageTitle}`);
    
    // Assert page title matches exactly
    expect(pageTitle).toBe(expectedTitle);
});

Then('I should be on the inventory page', async () => {
    logger.info('Step: Verifying navigation to inventory page');
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain('/inventory');
    logger.info(`Successfully navigated to: ${currentUrl}`);
});

/**
 * Hooks
 */
Before({ tags: '@performance_glitch_user' }, async () => {
    logger.info('Before hook: Setting up for performance_glitch_user');
    await browser.setTimeout({ 
        implicit: 30000,
        pageLoad: 90000,
        script: 90000
    });
    await browser.pause(3000);
});

Before(async function(scenario) {
    // Initialize context
    this.username = '';
    
    // Check scenario name and steps for performance_glitch_user
    const scenarioName = scenario.pickle.name || '';
    const steps = scenario.pickle.steps || [];
    
    // Check if performance_glitch_user is in scenario
    if (scenarioName.includes('performance_glitch_user') || 
        steps.some(step => step.text && step.text.includes('performance_glitch_user'))) {
        logger.info('Before hook: Performance glitch user detected, setting longer timeouts');
        await browser.setTimeout({ 
            implicit: 30000,
            pageLoad: 90000,
            script: 90000
        });
        await browser.pause(3000);
    }
});

After(async function(scenario) {
    if (scenario.result && scenario.result.status === 'FAILED') {
        logger.error(`Scenario failed: ${scenario.pickle.name}`);
        try {
            await browser.takeScreenshot();
        } catch (e) {
            logger.error('Failed to take screenshot: ' + e.message);
        }
    }
});

