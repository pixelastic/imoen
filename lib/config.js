const path = require('path');
const os = require('os');

module.exports = {
  /**
   * Where to save the downloaded files for cache
   * @returns {string} Cache directory
   **/
  cacheDirectory() {
    return path.resolve(os.tmpdir(), 'imoen');
  },
  cache: {},
};
