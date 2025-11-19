/**
 * Data Provider for parameterized tests
 * Provides test data for different test scenarios
 */
const logger = require('./Logger');

class DataProvider {
    
    /**
     * Get test data for login tests
     * @returns {Array} Array of test data objects
     */
    static getLoginTestData() {
        return [
            {
                testName: 'Valid Standard User',
                username: 'standard_user',
                password: 'secret_sauce',
                expectedResult: 'success'
            },
            {
                testName: 'Valid Problem User',
                username: 'problem_user',
                password: 'secret_sauce',
                expectedResult: 'success'
            },
            {
                testName: 'Valid Performance Glitch User',
                username: 'performance_glitch_user',
                password: 'secret_sauce',
                expectedResult: 'success'
            }
        ];
    }
    
    /**
     * Get test data for empty credentials test
     * @returns {Object} Test data object
     */
    static getEmptyCredentialsData() {
        return {
            testName: 'Empty Credentials Test',
            username: '',
            password: '',
            expectedError: 'Username is required'
        };
    }
    
    /**
     * Get test data for missing password test
     * @returns {Array} Array of test data objects
     */
    static getMissingPasswordData() {
        return [
            {
                testName: 'Missing Password - Standard User',
                username: 'standard_user',
                password: '',
                expectedError: 'Password is required'
            },
            {
                testName: 'Missing Password - Problem User',
                username: 'problem_user',
                password: '',
                expectedError: 'Password is required'
            }
        ];
    }
    
    /**
     * Get accepted usernames list
     * @returns {Array} Array of accepted usernames
     */
    static getAcceptedUsernames() {
        return [
            'standard_user',
            'locked_out_user',
            'problem_user',
            'performance_glitch_user',
            'error_user',
            'visual_user'
        ];
    }
    
    /**
     * Get valid password (secret value)
     * @returns {string} Valid password
     */
    static getValidPassword() {
        return 'secret_sauce';
    }
    
    /**
     * Log test data for debugging
     * @param {string} testName - Name of the test
     * @param {Object} testData - Test data object
     */
    static logTestData(testName, testData) {
        logger.info(`Test Data for ${testName}:`, {
            username: testData.username || 'N/A',
            password: testData.password ? '***' : 'N/A',
            expectedResult: testData.expectedResult || testData.expectedError || 'N/A'
        });
    }
}

module.exports = DataProvider;


