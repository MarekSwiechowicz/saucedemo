/**
 * UC-2: Login Form - Username Only (BDD)
 *
 * Feature: Login Form Validation
 * Scenario Outline: Login with username only - missing password
 */

const LoginPage = require('../pages/LoginPage');
const DataProvider = require('../utils/DataProvider');
const logger = require('../utils/Logger');

describe('Feature: Login Form - Username Only', () => {
    
    const testDataArray = DataProvider.getMissingPasswordData();
    
    testDataArray.forEach((testData) => {
        describe(`Scenario: ${testData.testName}`, () => {
            
            beforeEach(async () => {
                logger.info(`GIVEN: User is on the SauceDemo login page (${testData.testName})`);

                await browser.setTimeout({
                    implicit: 0,
                    pageLoad: 20000,
                    script: 20000
                });

                await LoginPage.open();
            });
            
            it('should display "Password is required" error when password is empty', async () => {

                DataProvider.logTestData('UC-2', testData);

                logger.info(`GIVEN: Username entered as "${testData.username}"`);
                await LoginPage.enterUsername(testData.username);

                logger.info('GIVEN: Password field left empty');

                logger.info('WHEN: Login button is clicked');
                await LoginPage.clickLogin();

                logger.info('THEN: Waiting for error message');

                await browser.waitUntil(
                    async () => await LoginPage.isErrorMessageDisplayed(),
                    {
                        timeout: 5000,
                        interval: 200,
                        timeoutMsg: 'Expected password error but none appeared'
                    }
                );

                const error = await LoginPage.getErrorMessage();
                logger.info(`Error message: ${error}`);

                expect(error).toMatch(/Password is required/i);
                expect(error.trim().length).toBeGreaterThan(0);
            });
            
            afterEach(() => {
                logger.info(`UC-2 completed: ${testData.testName}`);
            });
        });
    });
});
