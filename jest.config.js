const config = require('aberlaas/lib/configs/jest.js');
const path = require('path');

const globalSetup = path.resolve(__dirname, './lib/jest/globalSetup.js');
const globalTeardown = path.resolve(__dirname, './lib/jest/globalTeardown.js');
const testEnvironment = path.resolve(
  __dirname,
  './lib/jest/testEnvironment.js'
);
module.exports = {
  ...config,
  // Start a server to download the images from before tests and kill it
  // afterwards
  globalSetup,
  globalTeardown,
  // Pass global variables
  testEnvironment,
};
