Feature: Login Form - Valid Credentials
  As a user
  I want to login with valid credentials
  So that I can access the application

  Scenario Outline: Login with valid username and password
    Given I am on the SauceDemo login page
    When I enter "<username>" in the username field
    And I enter "secret_sauce" in the password field
    And I click the Login button
    Then I should be successfully logged in
    And I should see the page title "Swag Labs"
    And I should be on the inventory page

    Examples:
      | username      |
      | standard_user |
      | problem_user  |

