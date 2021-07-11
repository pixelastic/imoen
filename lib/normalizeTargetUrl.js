const path = require('path');
const config = require('./config');
const { urlToFilepath, exist, download } = require('firost');

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

  // Use caching
  if (config.cache[downloadPath]) {
    return config.cache[downloadPath];
  }

  if (await exist(downloadPath)) {
    return (config.cache[url] = downloadPath);
  }

  try {
    await download(url, downloadPath);
    config.cache[url] = downloadPath;
    return downloadPath;
  } catch (err) {
    return false;
  }
};
