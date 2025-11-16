/**
 * UC-3: Test login form with valid Username and Password
 * 
 * Steps:
 * 1. Enter a username from the Accepted usernames list
 * 2. Enter a valid password (use as a secret value)
 * 3. Click the Login button
 * 4. Verify successful login by checking that the title "Swag Labs" appears on the dashboard
 */
const LoginPage = require('../pages/LoginPage');
const DataProvider = require('../utils/DataProvider');
const logger = require('../utils/Logger');

describe('UC-3: Login Form - Valid Credentials', () => {
    
    const testDataArray = DataProvider.getLoginTestData();
    
    testDataArray.forEach((testData) => {
        describe(`Test: ${testData.testName}`, () => {
            
            beforeEach(async () => {
                logger.info(`Starting UC-3 test: ${testData.testName}`);
                // For performance_glitch_user, set longer timeouts and wait before opening
                if (testData.username === 'performance_glitch_user') {
                    await browser.setTimeout({ 
                        implicit: 30000,
                        pageLoad: 90000,
                        script: 90000
                    });
                    // Wait a bit before opening to let Chrome stabilize
                    await browser.pause(3000);
                }
                
                try {
                    await LoginPage.open();
                } catch (e) {
                    // If session is lost during open, reload session and retry
                    if (e.message && (e.message.includes('session') || e.message.includes('invalid'))) {
                        logger.info('Session lost during page open, reloading session...');
                        await browser.reloadSession();
                        await browser.setTimeout({ 
                            implicit: 30000,
                            pageLoad: 90000,
                            script: 90000
                        });
                        await LoginPage.open();
                    } else {
                        throw e;
                    }
                }
                
                // For performance_glitch_user, wait longer after opening to let page stabilize
                if (testData.username === 'performance_glitch_user') {
                    await browser.pause(8000); // Increased wait time
                }
            });
            
            it('should successfully login and display "Swag Labs" title', async () => {
                DataProvider.logTestData('UC-3', testData);
                
                // Step 1: Enter a username from the Accepted usernames list
                logger.info(`Step 1: Entering username: ${testData.username}`);
                let usernameEntered = false;
                let attempts = 0;
                const maxAttempts = testData.username === 'performance_glitch_user' ? 3 : 1;
                
                while (!usernameEntered && attempts < maxAttempts) {
                    try {
                        await LoginPage.enterUsername(testData.username);
                        usernameEntered = true;
                    } catch (e) {
                        attempts++;
                        if (attempts >= maxAttempts) {
                            throw e;
                        }
                        // For performance_glitch_user, retry if session was lost
                        if (testData.username === 'performance_glitch_user' && 
                            e.message && (e.message.includes('session') || e.message.includes('invalid'))) {
                            logger.info(`Session lost during username entry (attempt ${attempts}), reloading session...`);
                            await browser.pause(3000);
                            // Reload the session to recover
                            try {
                                await browser.reloadSession();
                                await browser.setTimeout({ 
                                    implicit: 30000,
                                    pageLoad: 90000,
                                    script: 90000
                                });
                                await LoginPage.open();
                                await browser.pause(5000);
                                logger.info('Session reloaded, retrying username entry...');
                            } catch (reloadError) {
                                logger.error('Failed to reload session: ' + reloadError.message);
                                throw new Error('Browser session lost and cannot be recovered: ' + reloadError.message);
                            }
                        } else {
                            throw e;
                        }
                    }
                }
                
                // Step 2: Enter a valid password (use as a secret value)
                logger.info('Step 2: Entering valid password');
                await LoginPage.enterPassword(testData.password);
                
                // For performance_glitch_user, add a pause before clicking to prevent browser timeout
                if (testData.username === 'performance_glitch_user') {
                    logger.info('Performance glitch user detected, waiting before login...');
                    await browser.pause(1000);
                }
                
                // Step 3: Click the Login button
                logger.info('Step 3: Clicking Login button');
                const useJsClick = testData.username === 'performance_glitch_user';
                
                try {
                    await LoginPage.clickLogin(useJsClick);
                } catch (e) {
                    // For performance_glitch_user, try one more time with a longer wait
                    if (testData.username === 'performance_glitch_user') {
                        logger.info('First click attempt failed, waiting and retrying...');
                        await browser.pause(3000);
                        await LoginPage.clickLogin(true); // Force JS click on retry
                    } else {
                        throw e;
                    }
                }
                
                // Step 4: Verify successful login by checking that the title "Swag Labs" appears on the dashboard
                logger.info('Step 4: Verifying successful login');
                
                // Wait for successful login and verify (longer timeout for performance_glitch_user)
                const timeout = testData.username === 'performance_glitch_user' ? 30000 : 10000;
                const interval = testData.username === 'performance_glitch_user' ? 2000 : 500;
                
                await browser.waitUntil(async () => {
                    try {
                        return await LoginPage.isLoginSuccessful();
                    } catch (e) {
                        // Handle browser disconnection during wait
                        if (e.message && (e.message.includes('session') || e.message.includes('disconnected'))) {
                            logger.info('Browser disconnected during wait, retrying...');
                            // Wait a bit and try to reconnect
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
                
                const pageTitle = await LoginPage.getPageTitle();
                logger.info(`Page title displayed: ${pageTitle}`);
                
                // Assert page title matches exactly
                expect(pageTitle).toBe('Swag Labs');
                
                // Additional verification: Check that we're on the inventory page
                const currentUrl = await browser.getUrl();
                expect(currentUrl).toContain('/inventory.html');
                logger.info(`Successfully navigated to: ${currentUrl}`);
            });
            
            afterEach(() => {
                logger.info(`UC-3 test completed: ${testData.testName}`);
            });
        });
    });
});

