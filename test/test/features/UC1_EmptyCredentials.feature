Feature: Login Form - Empty Credentials (UC-1)
  As a user
  I want to see an error message when attempting to login with empty credentials
  So that I understand what information is required

  Background:
    Given I am on the SauceDemo login page

  Scenario: Login with empty username and password fields
    Given I have entered temporary credentials in the username and password fields
    When I clear both the username and password fields
    And I click the Login button
    Then I should see an error message containing "Username is required"

