Feature: Login Form - Username Only (UC-2)
  As a user
  I want to see an error message when attempting to login with only username
  So that I understand that password is also required

  Background:
    Given I am on the SauceDemo login page

  Scenario Outline: Login with username only - missing password
    Given I have entered "<username>" in the username field
    And I have left the password field empty
    When I click the Login button
    Then I should see an error message containing "Password is required"

    Examples:
      | username        |
      | standard_user   |
      | problem_user    |

