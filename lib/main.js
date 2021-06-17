const path = require('path');
const os = require('os');
const sharp = require('sharp');
const isFile = require('firost/isFile');
const urlToFilepath = require('firost/urlToFilepath');
const download = require('firost/download');
const isUrl = require('firost/isUrl');

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
   * Returns a base64 encoded string of an image LQIP
   * @param {string} target URL or filepath to the image
   * @returns {string|boolean} Base64 encoded string of the image LQIP, or false
   * if no such file
   **/
  async lqip(target) {
    const filepath = await this.normalizePath(target);
    if (!filepath) {
      return false;
    }

    const image = sharp(filepath);
    const buffer = await image.resize(8, 8, { fit: 'inside' }).toBuffer();
    return buffer.toString('base64');
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
