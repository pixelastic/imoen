import { absolute } from 'firost';
import { readImage, writeImage } from './helpers/index.js';
import { normalizeTarget } from './normalizeTarget.js';

/**
 * Resize an image to pixel dimensions, never enlarging it
 * @param {string} source URL or filepath to the image
 * @param {string} destination Path to the output file
 * @param {object} options Resize options
 * @param {number} [options.width] Width in pixels
 * @param {number} [options.height] Height in pixels
 * @returns {string|boolean} Absolute path to the output file, or false if no
 * such source
 **/
export async function resize(source, destination, options = {}) {
  const { width, height } = options;
  if (width === undefined && height === undefined) {
    throw new Error('resize requires a width or a height');
  }
  if (width <= 0 || height <= 0) {
    throw new Error('resize width and height must be positive');
  }

  const filepath = await normalizeTarget(source);
  if (!filepath) {
    return false;
  }

  // fill needs both dimensions, or it does not keep the ratio
  const hasBoth = width && height;
  const pipeline = readImage(filepath).resize({
    width,
    height,
    fit: hasBoth ? 'fill' : 'inside',
    withoutEnlargement: true,
  });
  await writeImage(pipeline, destination);
  return absolute(destination);
}
