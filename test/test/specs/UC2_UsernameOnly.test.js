/**
 * UC-2: Test login form with credentials by passing Username
 * 
 * Steps:
 * 1. Type any credentials into the Username field
 * 2. Leave the Password field empty
 * 3. Click the Login button
 * 4. Verify that the error message "Password is required" appears
 */
const LoginPage = require('../pages/LoginPage');
const DataProvider = require('../utils/DataProvider');
const logger = require('../utils/Logger');

describe('UC-2: Login Form - Username Only', () => {
    
    const testDataArray = DataProvider.getMissingPasswordData();
    
    testDataArray.forEach((testData) => {
        describe(`Test: ${testData.testName}`, () => {
            
            beforeEach(async () => {
                logger.info(`Starting UC-2 test: ${testData.testName}`);
                await LoginPage.open();
            });
            
            it('should display "Password is required" error when password is empty', async () => {
                DataProvider.logTestData('UC-2', testData);
                
                // Step 1: Type any credentials into the Username field
                logger.info(`Step 1: Entering username: ${testData.username}`);
                await LoginPage.enterUsername(testData.username);
                
                // Step 2: Leave the Password field empty
                logger.info('Step 2: Leaving password field empty');
                // Password field is already empty, no action needed
                
                // Step 3: Click the Login button
                logger.info('Step 3: Clicking Login button');
                await LoginPage.clickLogin();
                
                // Step 4: Verify that the error message "Password is required" appears
                logger.info('Step 4: Verifying error message');
                
                // Wait for error message to appear and verify it's displayed
                await browser.waitUntil(async () => {
                    return await LoginPage.isErrorMessageDisplayed();
                }, {
                    timeout: 5000,
                    timeoutMsg: 'Error message did not appear within 5 seconds'
                });
                
                expect(await LoginPage.isErrorMessageDisplayed()).toBe(true);
                
                const errorMessage = await LoginPage.getErrorMessage();
                logger.info(`Error message displayed: ${errorMessage}`);
                
                // Assert error message contains the expected text (SauceDemo prepends "Epic sadface: ")
                expect(errorMessage).toMatch(/Password is required/i);
                
                // Additional assertion to ensure error message is not empty
                expect(errorMessage.length).toBeGreaterThan(0);
            });
            
            afterEach(() => {
                logger.info(`UC-2 test completed: ${testData.testName}`);
            });
        });
    });
});

