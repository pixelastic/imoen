const path = require('path');
const os = require('os');
const sharp = require('sharp');
const isFile = require('firost/isFile');
const urlToFilepath = require('firost/urlToFilepath');
const download = require('firost/download');
const isUrl = require('is-url-superb');

// const PLACEHOLDER_MAX_DIMENSION = 8;
// Using sharp is easier as it handles both dimensions and resize
// If needed, we can use the imagemagick approach wich should bring smaller
// filesize
// const convertOptions = [
//   '-resize 16', // Small enough it retains some shape
//   '-define png:compression-filter=5', // Reorganize data so compression is more efficient
//   '-define png:compression-level=9', // Max compression
//   '-define png:compression-strategy=1', // Default compression strategy
//   '-blur 0x0.1', // Really simple blur
//   '-strip', // Remove all metadata
//   '-define png:exclude-chunk=all', // Remove PNG metadata
//   '-interlace none', // Load sequentially (not progressive)
// ];

module.exports = {
  /**
   * Returns an object with .width and .height of the target
   * @param {string} target URL or filepath to the image
   * @returns {object|boolean} Object with the dimensions or false if not found
   **/
  async dimensions(target) {
    const filepath = await this.normalizePath(target);
    if (!filepath) {
      return false;
    }
    const image = sharp(filepath);
    const { width, height } = await image.metadata();
    return { width, height };
  },
  /**
   * Normalize an input path.
   * Accepts both url and filepaths but always return an absolute filepath
   * @param {string} target URL or filepath
   * @returns {string|boolean} Absolute filepath, or false if not found
   **/
  async normalizePath(target) {
    // File on disk
    if (!isUrl(target)) {
      const filepath = path.resolve(target);
      if (!(await isFile(filepath))) {
        return false;
      }
      return filepath;
    }

    // Remote URL
    // Download the file in a temp directory and return the path
    const downloadPath = path.resolve(
      os.tmpdir(),
      'imoen',
      urlToFilepath(target)
    );
    try {
      await download(target, downloadPath);
    } catch (err) {
      return false;
    }
    return downloadPath;
  },
};
