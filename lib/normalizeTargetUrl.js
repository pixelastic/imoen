const path = require('path');
const config = require('./config');
const { urlToFilepath, exist, download } = require('firost');
const sharp = require('sharp');

/**
 * Normalize an url target
 * @param {string} url Url to the image.
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
module.exports = async (url) => {
  const downloadPath = path.resolve(
    config.cacheDirectory(),
    urlToFilepath(url)
  );

  // Check if the file is already downloaded (ignoring files with 0 size,
  // because it means the download failed
  if (await exist(downloadPath, { ignoreEmptyFiles: true })) {
    try {
      // If we can parse the image, it's valid, and we return the path
      await sharp(downloadPath).stats();
      return downloadPath;
    } catch (err) {
      // Can't parse the image, we go back to downloading
    }
  }

  // Downloading the image
  try {
    await download(url, downloadPath);
    return downloadPath;
  } catch (err) {
    return false;
  }
};
