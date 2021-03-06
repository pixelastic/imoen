const path = require('path');
const config = require('./config');
const { urlToFilepath, exist, download } = require('firost');
const isValid = require('./isValid');

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
    if (await isValid(downloadPath)) {
      return downloadPath;
    }
  }

  // Downloading the image
  try {
    await download(url, downloadPath);

    // If the downloaded image is invalid, we try one more time. Maybe it was
    // a temporary network issue
    if (!(await isValid(downloadPath))) {
      await download(url, downloadPath);
    }

    return downloadPath;
  } catch (err) {
    return false;
  }
};
