const normalizeTargetUrl = require('./normalizeTargetUrl.js');
const normalizeTargetPath = require('./normalizeTargetPath.js');
const { isUrl } = require('firost');

/**
 * Normalize an input target
 * Accepts both url and filepaths but always return an absolute filepath
 * @param {string} target URL or filepath
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
module.exports = async (target) => {
  return isUrl(target)
    ? normalizeTargetUrl(target)
    : normalizeTargetPath(target);
};
