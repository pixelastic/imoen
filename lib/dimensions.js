import { readImage } from './helpers/index.js';
import { normalizeTarget } from './normalizeTarget.js';

export let __;

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

  return __.hasSwappedAxes(orientation)
    ? { width: height, height: width }
    : { width, height };
}

__ = {
  /**
   * Check if the EXIF orientation displays the image on its side, meaning the
   * stored width and height are the displayed height and width
   * @param {number} [orientation] EXIF orientation, from 1 to 8
   * @returns {boolean} True if the stored width and height must be swapped
   **/
  hasSwappedAxes(orientation) {
    const sidewaysOrientations = [5, 6, 7, 8];
    return sidewaysOrientations.includes(orientation);
  },
};
