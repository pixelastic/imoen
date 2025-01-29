import config from 'aberlaas/configs/vite';

export default {
  ...config,
};


// Below is the code that was used with jest to spin a server and load images
// from it
// const config = require('aberlaas/configs/jest.js');
// const path = require('path');

// const globalSetup = path.resolve(__dirname, './lib/jest/globalSetup.js');
// const globalTeardown = path.resolve(__dirname, './lib/jest/globalTeardown.js');
// const testEnvironment = path.resolve(
//   __dirname,
//   './lib/jest/testEnvironment.js'
// );
// module.exports = {
//   ...config,
//   // Start a server to download the images from before tests and kill it
//   // afterwards
//   globalSetup,
//   globalTeardown,
//   // Pass global variables
//   testEnvironment,
// };
