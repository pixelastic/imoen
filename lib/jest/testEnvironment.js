const NodeEnvironment = require('jest-environment-node');
const serverPort = require('./serverPort.js');

class TestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();
    const serverPortValue = await serverPort.get();
    this.global.serverUrl = `http://127.0.0.1:${serverPortValue}`;
  }
}

module.exports = TestEnvironment;
