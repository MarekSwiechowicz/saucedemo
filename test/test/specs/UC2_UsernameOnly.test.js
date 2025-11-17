/**
 * UC-2: Login Form - Username Only (BDD)
 * 
 * Feature: Login Form Validation
 * As a user
 * I want to see an error message when attempting to login with only username
 * So that I understand that password is also required
 * 
 * Scenario Outline: Login with username only - missing password
 * Given: User is on the SauceDemo login page
 * When: User enters username but leaves password empty and clicks login
 * Then: System displays "Password is required" error message
 */
const LoginPage = require('../pages/LoginPage');
const DataProvider = require('../utils/DataProvider');
const logger = require('../utils/Logger');

describe('Feature: Login Form - Username Only', () => {
    
    const testDataArray = DataProvider.getMissingPasswordData();
    
    testDataArray.forEach((testData) => {
        describe(`Scenario: ${testData.testName}`, () => {
            
            // GIVEN: User is on the SauceDemo login page
            beforeEach(async () => {
                logger.info(`GIVEN: User is on the SauceDemo login page (${testData.testName})`);
                await LoginPage.open();
            });
            
            it('should display "Password is required" error when password is empty', async () => {
                DataProvider.logTestData('UC-2', testData);
                
                // GIVEN: User has entered username in the username field
                logger.info(`GIVEN: User has entered "${testData.username}" in the username field`);
                await LoginPage.enterUsername(testData.username);
                
                // GIVEN: User has left the password field empty
                logger.info('GIVEN: User has left the password field empty');
                // Password field is already empty, no action needed
                
                // WHEN: User clicks the Login button
                logger.info('WHEN: User clicks the Login button');
                await LoginPage.clickLogin();
                
                // THEN: User should see an error message containing "Password is required"
                logger.info('THEN: Verifying error message appears');
                
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

