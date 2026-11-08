import { readImage } from './helpers/index.js';
import { normalizeTarget } from './normalizeTarget.js';

/**
 * Returns an object with .width and .height of the target, as displayed (EXIF
 * orientation applied)
 * @param {string} target URL or filepath to the image
 * @returns {object|boolean} Object with the dimensions or false if not found
 **/
export async function dimensions(target) {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const image = readImage(filepath);
  const { width, height, orientation } = await image.metadata();

  // EXIF orientations 5 to 8 are rotated by a quarter turn
  const isQuarterTurn = orientation >= 5;
  return isQuarterTurn ? { width: height, height: width } : { width, height };
}
