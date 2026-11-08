import { absolute } from 'firost';
import { readImage, writeImage } from './helpers/index.js';
import { normalizeTarget } from './normalizeTarget.js';

/**
 * Convert an image to the format of the destination extension
 * @param {string} source URL or filepath to the image
 * @param {string} destination Path to the output file
 * @param {object} options Options passed as-is to the sharp format method
 * @returns {string|boolean} Absolute path to the output file, or false if no
 * such source
 **/
export async function convert(source, destination, options = {}) {
  const filepath = await normalizeTarget(source);
  if (!filepath) {
    return false;
  }
  const destinationPath = absolute(destination);

  await writeImage(readImage(filepath), destinationPath, options);
  return destinationPath;
}
