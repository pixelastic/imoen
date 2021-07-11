const normalizeTarget = require('./normalizeTarget');
const sharp = require('sharp');

/**
 * Returns an object with .width and .height of the target
 * @param {string} target URL or filepath to the image
 * @returns {object|boolean} Object with the dimensions or false if not found
 **/
module.exports = async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }
  const image = sharp(filepath);
  const { width, height } = await image.metadata();
  return { width, height };
};
