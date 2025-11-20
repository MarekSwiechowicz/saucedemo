Feature: Login Form - Empty Credentials
  As a user
  I want to see an error message when attempting to login with empty credentials
  So that I understand what information is required

  Scenario: Login with empty username and password fields
    Given I am on the SauceDemo login page
    When I enter temporary credentials in username and password fields
    And I clear both username and password fields
    And I click the Login button
    Then I should see an error message containing "Username is required"
