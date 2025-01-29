import path from 'path';
import {
  absolute,
  download,
  exists,
  isFile,
  isUrl,
  urlToFilepath,
} from 'firost';
import helper from './helper.js';

/**
 * Normalize an input target
 * Accepts both url and filepaths but always return an absolute filepath
 * @param {string} target URL or filepath
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
export async function normalizeTarget(target) {
  return isUrl(target)
    ? normalizeTargetUrl(target)
    : normalizeTargetPath(target);
}

/**
 * Normalize an url target
 * @param {string} url Url to the image.
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
export async function normalizeTargetUrl(url) {
  const downloadPath = path.resolve(
    helper.cacheDirectory(),
    urlToFilepath(url),
  );

  // Check if the file is already downloaded (ignoring files with 0 size,
  // because it means the download failed
  if (await exists(downloadPath, { ignoreEmptyFiles: true })) {
    if (await helper.isImageValid(downloadPath)) {
      return downloadPath;
    }
  }

  // Downloading the image
  try {
    await download(url, downloadPath);

    // If the downloaded image is invalid, we try one more time. Maybe it was
    // a temporary network issue
    if (!(await helper.isImageValid(downloadPath))) {
      await download(url, downloadPath);
    }

    return downloadPath;
  } catch (_err) {
    return false;
  }
}

/**
 * Normalize a path target.
 * @param {string} filepath Path to the file
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
export async function normalizeTargetPath(filepath) {
  const absolutePath = absolute(filepath);

  // Use caching
  if (helper.cache[absolutePath]) {
    return helper.cache[absolutePath];
  }

  if (!(await isFile(absolutePath))) {
    return false;
  }

  helper.cache[absolutePath] = absolutePath;
  return absolutePath;
}
