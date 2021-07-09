const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const sharp = require('sharp');
const isFile = require('firost/isFile');
const exist = require('firost/exist');
const urlToFilepath = require('firost/urlToFilepath');
const download = require('firost/download');
const isUrl = require('firost/isUrl');

const imoen = async (target) => {
  const filepath = await imoen.normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const { width, height } = await imoen.dimensions(filepath);
  const lqip = await imoen.lqip(filepath);
  const filesize = imoen.filesize(filepath);
  return {
    width,
    height,
    lqip,
    filesize,
  };
};

const cache = {};

/**
 * Returns an object with .width and .height of the target
 * @param {string} target URL or filepath to the image
 * @returns {object|boolean} Object with the dimensions or false if not found
 **/
imoen.dimensions = async (target) => {
  const filepath = await imoen.normalizeTarget(target);
  if (!filepath) {
    return false;
  }
  const image = sharp(filepath);
  const { width, height } = await image.metadata();
  return { width, height };
};

/**
 * Returns a base64 encoded string of an image LQIP
 * @param {string} target URL or filepath to the image
 * @returns {string|boolean} Base64 encoded string of the image LQIP, or false
 * if no such file
 **/
imoen.lqip = async (target) => {
  const filepath = await imoen.normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const extname = path.extname(filepath).replace('.', '');

  const image = sharp(filepath);
  const buffer = await image.resize(16, 16, { fit: 'inside' }).toBuffer();
  const lqip = buffer.toString('base64');

  return `data:image/${extname};base64,${lqip}`;
};

/**
 * Returns the image filesize
 * @param {string} target URL or filepath to the image
 * @returns {number} Size of the image, in bytes
 **/
imoen.filesize = async (target) => {
  const filepath = await imoen.normalizeTarget(target);
  if (!filepath) {
    return 0;
  }

  const { size } = await fs.stat(filepath);
  return size;
};

/**
 * Normalize an input target
 * Accepts both url and filepaths but always return an absolute filepath
 * @param {string} target URL or filepath
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
imoen.normalizeTarget = async (target) => {
  // Use caching
  if (cache[target]) {
    return cache[target];
  }

  return isUrl(target)
    ? imoen.normalizeTargetUrl(target)
    : imoen.normalizeTargetPath(target);
};

/**
 * Normalize a path target.
 * @param {string} filepath Path to the file
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
imoen.normalizeTargetPath = async (filepath) => {
  const absolutePath = path.resolve(filepath);
  if (!(await isFile(absolutePath))) {
    return false;
  }

  return (cache[filepath] = absolutePath);
};

/**
 * Normalize an url target
 * @param {string} url Url to the image.
 * @returns {string|boolean} Absolute filepath, or false if not found
 **/
imoen.normalizeTargetUrl = async (url) => {
  const downloadPath = path.resolve(imoen.cacheDirectory(), urlToFilepath(url));

  if (await exist(downloadPath)) {
    return (cache[url] = downloadPath);
  }

  try {
    await download(url, downloadPath);
    return (cache[url] = downloadPath);
  } catch (err) {
    return false;
  }
};

/**
 * Where to save the downloaded files for cache
 * @returns {string} Cache directory
 **/
imoen.cacheDirectory = () => {
  return path.resolve(os.tmpdir(), 'imoen');
};

module.exports = imoen;
