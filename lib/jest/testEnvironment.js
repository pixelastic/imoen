import NodeEnvironment from 'jest-environment-node';
import serverPort from './serverPort.js';

class TestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();
    this.global.serverUrl = `http://127.0.0.1:${serverPort}`;
  }
}

export default TestEnvironment;
