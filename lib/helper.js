import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';

export default {
  /**
   * Where to save the downloaded files for cache
   * @returns {string} Cache directory
   **/
  cacheDirectory() {
    return path.resolve(os.tmpdir(), 'imoen');
  },
  cache: {},
  /**
   * Check if an image on disk seem valid
   * @param {string} filepath Path to the file
   * @returns {boolean} True if valid image
   **/
  async isImageValid(filepath) {
    try {
      // If we can parse the image, it's valid
      await sharp(filepath).stats();
      return true;
    } catch (_err) {
      return false;
    }
  },
};
