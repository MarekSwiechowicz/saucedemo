Feature: Login Form - Valid Credentials (UC-3)
  As a user
  I want to login successfully with valid credentials
  So that I can access the application

  Background:
    Given I am on the SauceDemo login page

  Scenario Outline: Successful login with valid credentials
    Given I have entered "<username>" in the username field
    And I have entered a valid password in the password field
    When I click the Login button
    Then I should be successfully logged in
    And I should see the page title "Swag Labs"
    And I should be on the inventory page

    Examples:
      | username                |
      | standard_user           |
      | problem_user            |
      | performance_glitch_user |

