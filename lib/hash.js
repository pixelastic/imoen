import revHash from 'rev-hash';
import { read } from 'firost';
import normalizeTarget from './normalizeTarget.js';

/**
 * Returns a unique hash based on the file content
 * @param {string} target URL or filepath to the image
 * @returns {string} unique md5 of the file
 **/
export default async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const content = await read(filepath);
  return revHash(content);
};
