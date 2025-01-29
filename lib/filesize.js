import fs from 'fs-extra';
import { normalizeTarget } from './normalizeTarget.js';

/**
 * Returns the image filesize
 * @param {string} target URL or filepath to the image
 * @returns {number} Size of the image, in bytes
 **/
export async function filesize(target) {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return 0;
  }

  const { size } = await fs.stat(filepath);
  return size;
}
