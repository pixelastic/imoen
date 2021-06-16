const getPort = require('get-port');
module.exports = {
  __serverPort: null,
  async get() {
    if (!this.__serverPort) {
      this.__serverPort = await getPort();
    }
    return this.__serverPort;
  },
};
