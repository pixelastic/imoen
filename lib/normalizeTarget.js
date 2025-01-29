import { isUrl } from 'firost';
import normalizeTargetUrl from './normalizeTargetUrl.js';
import normalizeTargetPath from './normalizeTargetPath.js';

/**
 * Normalize an input target
 * Accepts both url and filepaths but always return an absolute filepath
 * @param {string} target URL or filepath
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
export default async (target) => {
  return isUrl(target)
    ? normalizeTargetUrl(target)
    : normalizeTargetPath(target);
};
