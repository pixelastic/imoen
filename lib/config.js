import path from 'path';
import os from 'os';

export default {
  /**
   * Where to save the downloaded files for cache
   * @returns {string} Cache directory
   **/
  cacheDirectory() {
    return path.resolve(os.tmpdir(), 'imoen');
  },
  cache: {},
};
