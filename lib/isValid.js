const sharp = require('sharp');

/**
 * Check if an image on disk seem valid
 * @param {string} filepath Path to the file
 * @returns {boolean} True if valid image
 **/
module.exports = async (filepath) => {
  try {
    // If we can parse the image, it's valid
    await sharp(filepath).stats();
    return true;
  } catch (err) {
    return false;
  }
};
