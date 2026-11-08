import { _ } from 'golgoth';
import { absolute } from 'firost';
import { dimensions } from './dimensions.js';
import { readImage, writeImage } from './helpers/index.js';
import { normalizeTarget } from './normalizeTarget.js';

export let __;

/**
 * Resize an image to pixel or percentage dimensions, never enlarging it unless
 * forced
 * @param {string} source URL or filepath to the image
 * @param {string} destination Path to the output file
 * @param {object} options Resize options
 * @param {number|string} [options.width] Width in pixels, or as a percentage
 * of the upright source width (like '50%')
 * @param {number|string} [options.height] Height in pixels, or as a percentage
 * of the upright source height (like '50%')
 * @param {boolean} [options.force] Allow the output to exceed the source size
 * @param {object} [options.convert] Options passed as-is to the sharp format
 * method
 * @returns {string|boolean} Absolute path to the output file, or false if no
 * such source
 **/
export async function resize(source, destination, options = {}) {
  const { width, height, force, convert } = options;
  if (width === undefined && height === undefined) {
    throw new Error('resize requires a width or a height');
  }
  __.validateSize(width);
  __.validateSize(height);

  const filepath = await normalizeTarget(source);
  if (!filepath) {
    return false;
  }

  const sourceSize = await __.getSourceSize(filepath, [width, height]);
  const targetWidth = __.toPixels(width, sourceSize.width);
  const targetHeight = __.toPixels(height, sourceSize.height);

  // fill needs both dimensions, or it does not keep the ratio
  const hasBoth = targetWidth && targetHeight;
  const pipeline = readImage(filepath).resize({
    width: targetWidth,
    height: targetHeight,
    fit: hasBoth ? 'fill' : 'inside',
    withoutEnlargement: !force,
  });
  await writeImage(pipeline, destination, convert);
  return absolute(destination);
}

__ = {
  /**
   * Check that a width or height is a positive number or percentage
   * @param {number|string} [value] Width or height to check
   **/
  validateSize(value) {
    if (_.isString(value) && !/^-?\d+(\.\d+)?%$/.test(value)) {
      throw new Error(
        'resize width and height must be a number or a percentage',
      );
    }
    const number = _.isString(value) ? Number.parseFloat(value) : value;
    if (number <= 0) {
      throw new Error('resize width and height must be positive');
    }
  },
  /**
   * Read the upright source size, only when a percentage needs it
   * @param {string} filepath Path to the source image
   * @param {Array} sizes Requested widths and heights
   * @returns {object} The upright width and height, or an empty object
   **/
  async getSourceSize(filepath, sizes) {
    return _.some(sizes, _.isString) ? await dimensions(filepath) : {};
  },
  /**
   * Convert a pixel or percentage size to pixels
   * @param {number|string} [value] Size in pixels, or as a percentage
   * @param {number} [reference] Source size the percentage applies to
   * @returns {number|undefined} Size in pixels
   **/
  toPixels(value, reference) {
    if (!_.isString(value)) {
      return value;
    }
    return Math.max(
      1,
      Math.round((Number.parseFloat(value) / 100) * reference),
    );
  },
};
