const logger = require("./Logger");

class DataProvider {
  static getLoginTestData() {
    return [
      {
        testName: "Valid Standard User",
        username: "standard_user",
        password: "secret_sauce",
        expectedResult: "success",
      },
    ];
  }

  static getEmptyCredentialsData() {
    return {
      testName: "Empty Credentials Test",
      username: "",
      password: "",
      expectedError: "Username is required",
    };
  }

  static getMissingPasswordData() {
    return [
      {
        testName: "Missing Password - Standard User",
        username: "standard_user",
        password: "",
        expectedError: "Password is required",
      },
      {
        testName: "Missing Password - Problem User",
        username: "problem_user",
        password: "",
        expectedError: "Password is required",
      },
    ];
  }

  static getAcceptedUsernames() {
    return [
      "standard_user",
      "locked_out_user",
      "problem_user",
      "performance_glitch_user",
      "error_user",
      "visual_user",
    ];
  }

  static getValidPassword() {
    return "secret_sauce";
  }

  static logTestData(testName, testData) {
    logger.info(`Test Data for ${testName}:`, {
      username: testData.username || "N/A",
      password: testData.password ? "***" : "N/A",
      expectedResult:
        testData.expectedResult || testData.expectedError || "N/A",
    });
  }
}

module.exports = DataProvider;
