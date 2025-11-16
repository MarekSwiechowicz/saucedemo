/**
 * UC-1: Test login form with empty credentials
 * 
 * Steps:
 * 1. Type any credentials into the Username and Password fields
 * 2. Clear both inputs
 * 3. Click the Login button
 * 4. Verify that the error message "Username is required" appears
 */
const LoginPage = require('../pages/LoginPage');
const DataProvider = require('../utils/DataProvider');
const logger = require('../utils/Logger');

describe('UC-1: Login Form - Empty Credentials', () => {
    
    beforeEach(async () => {
        logger.info('Starting UC-1 test: Empty Credentials');
        await LoginPage.open();
    });
    
    it('should display "Username is required" error when both fields are empty', async () => {
        const testData = DataProvider.getEmptyCredentialsData();
        DataProvider.logTestData('UC-1', testData);
        
        // Step 1: Type any credentials into the Username and Password fields
        logger.info('Step 1: Entering temporary credentials');
        await LoginPage.enterUsername('test_user');
        await LoginPage.enterPassword('test_password');
        
        // Step 2: Clear both inputs
        logger.info('Step 2: Clearing both input fields');
        await LoginPage.clearUsername();
        await LoginPage.clearPassword();
        
        // Wait a moment after clearing to ensure fields are truly empty (especially for Chrome)
        await browser.pause(500);
        
        // Step 3: Click the Login button
        logger.info('Step 3: Clicking Login button');
        await LoginPage.clickLogin();
        
        // Step 4: Verify that the error message "Username is required" appears
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
        expect(errorMessage).toMatch(/Username is required/i);
        
        // Additional assertion to ensure error message is not empty
        expect(errorMessage.length).toBeGreaterThan(0);
    });
    
    afterEach(() => {
        logger.info('UC-1 test completed');
    });
});

