Feature: Login Form - Username Only
  As a user
  I want to see an error message when attempting to login with only username
  So that I understand that password is required

  Scenario Outline: Login with username but empty password
    Given I am on the SauceDemo login page
    When I enter "<username>" in the username field
    And I clear the password field
    And I click the Login button
    Then I should see an error message containing "Password is required"

    Examples:
      | username      |
      | standard_user |
      | problem_user  |

