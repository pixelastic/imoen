import sharp from 'sharp';
import normalizeTarget from './normalizeTarget.js';

/**
 * Returns an object with .width and .height of the target
 * @param {string} target URL or filepath to the image
 * @returns {object|boolean} Object with the dimensions or false if not found
 **/
export default async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }
  const image = sharp(filepath);
  const { width, height } = await image.metadata();
  return { width, height };
};
