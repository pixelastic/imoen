const normalizeTarget = require('./normalizeTarget');
const fs = require('fs-extra');

/**
 * Returns the image filesize
 * @param {string} target URL or filepath to the image
 * @returns {number} Size of the image, in bytes
 **/
module.exports = async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return 0;
  }

  const { size } = await fs.stat(filepath);
  return size;
};
