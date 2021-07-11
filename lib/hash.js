const normalizeTarget = require('./normalizeTarget');
const revHash = require('rev-hash');
const { read } = require('firost');

/**
 * Returns a unique hash based on the file content
 * @param {string} target URL or filepath to the image
 * @returns {string} unique md5 of the file
 **/
module.exports = async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const content = await read(filepath);
  return await revHash(content);
};
