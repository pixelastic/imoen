import { absolute, isFile } from 'firost';
import config from './config.js';

/**
 * Normalize a path target.
 * @param {string} filepath Path to the file
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
export default async (filepath) => {
  const absolutePath = absolute(filepath);

  // Use caching
  if (config.cache[absolutePath]) {
    return config.cache[absolutePath];
  }

  if (!(await isFile(absolutePath))) {
    return false;
  }

  config.cache[absolutePath] = absolutePath;
  return absolutePath;
};
