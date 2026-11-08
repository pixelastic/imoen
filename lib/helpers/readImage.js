import sharp from 'sharp';

/**
 * Open an image as a sharp pipeline, with its EXIF orientation applied
 * @param {string} filepath Path to the file
 * @returns {object} Sharp pipeline of the upright image
 **/
export function readImage(filepath) {
  return sharp(filepath).rotate();
}
