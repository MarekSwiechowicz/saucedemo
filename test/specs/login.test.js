const LoginPage = require('../pages/LoginPage');
const loginData = require('../data/loginData');

describe('SauceDemo Login Tests', () => {
    
    beforeEach(async () => {
        console.log(`[${new Date().toISOString()}] Starting test: ${this.currentTest?.title || 'Unknown'}`);
        await LoginPage.open();
    });
    
    afterEach(async () => {
        console.log(`[${new Date().toISOString()}] Completed test: ${this.currentTest?.title || 'Unknown'}`);
    });
    
    describe('UC-1: Test Login form with empty credentials', () => {
        it('should display "Username is required" error when both fields are cleared', async () => {
            console.log('[UC-1] Step 1: Entering credentials in username and password fields');
            await LoginPage.enterUsername(loginData.testData.anyUsername);
            await LoginPage.enterPassword(loginData.testData.anyPassword);
            
            console.log('[UC-1] Step 2: Clearing both input fields');
            await LoginPage.clearUsername();
            await LoginPage.clearPassword();
            
            console.log('[UC-1] Step 3: Clicking Login button');
            await LoginPage.clickLogin();
            
            console.log('[UC-1] Step 4: Verifying error message');
            const errorMessage = await LoginPage.getErrorMessage();
            expect(errorMessage).toBe('Epic sadface: Username is required');
            
            console.log('[UC-1] Test passed: Error message displayed correctly');
        });
    });
    
    describe('UC-2: Test Login form with credentials by passing Username', () => {
        it('should display "Password is required" error when password is cleared', async () => {
            console.log('[UC-2] Step 1: Entering username');
            await LoginPage.enterUsername(loginData.testData.anyUsername);
            
            console.log('[UC-2] Step 2: Entering password');
            await LoginPage.enterPassword(loginData.testData.anyPassword);
            
            console.log('[UC-2] Step 3: Clearing password field');
            await LoginPage.clearPassword();
            
            console.log('[UC-2] Step 4: Clicking Login button');
            await LoginPage.clickLogin();
            
            console.log('[UC-2] Step 5: Verifying error message');
            const errorMessage = await LoginPage.getErrorMessage();
            expect(errorMessage).toBe('Epic sadface: Password is required');
            
            console.log('[UC-2] Test passed: Error message displayed correctly');
        });
    });
    
    describe('UC-3: Test Login form with valid credentials', () => {
        loginData.validCredentials.forEach((credential) => {
            it(`should successfully login and display "Swag Labs" title for ${credential.description}`, async () => {
                console.log(`[UC-3] Step 1: Logging in with ${credential.username}`);
                await LoginPage.login(credential.username, credential.password);
                
                console.log('[UC-3] Step 2: Verifying browser title contains "Swag Labs"');
                const browserTitle = await LoginPage.getBrowserTitle();
                expect(browserTitle).toContain('Swag Labs');
                
                console.log('[UC-3] Step 3: Verifying "Swag Labs" header is displayed');
                const swagLabsHeader = await LoginPage.getSwagLabsHeader();
                expect(swagLabsHeader).toBe('Swag Labs');
                
                console.log(`[UC-3] Test passed: Successfully logged in as ${credential.username}`);
            });
        });
    });
});

