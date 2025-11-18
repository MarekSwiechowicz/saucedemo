const { runCucumber, loadConfiguration, loadSources } = require('@cucumber/cucumber/api');
const path = require('path');
const { createRequire } = require('module');

const requireModule = createRequire(import.meta.url || __filename);

async function runCucumberTests() {
  try {
    const configuration = await loadConfiguration({
      profiles: [],
      provided: {
        paths: ['./test/features/**/*.feature'],
        require: ['./test/features/step-definitions/**/*.js'],
        requireModule: ['@babel/register'],
        format: ['progress-bar'],
        formatOptions: {},
      },
    });

    const { runConfiguration } = configuration;
    const { success } = await runCucumber(runConfiguration);
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Error running Cucumber:', error);
    process.exit(1);
  }
}

runCucumberTests();

