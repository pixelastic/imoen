import { _ } from 'golgoth';
import { absolute, firostError } from 'firost';
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
    throw firostError(
      'IMOEN_RESIZE_MISSING_SIZE',
      'resize requires a width or a height',
    );
  }
  // Ensure width & height are valid
  __.assertSize(width);
  __.assertSize(height);

  // Ensure source exists
  const filepath = await normalizeTarget(source);
  if (!filepath) {
    return false;
  }

  // Calculate final width & height in pixels
  const { width: targetWidth, height: targetHeight } = await __.getTargetSize(
    filepath,
    width,
    height,
  );

  const destinationPath = absolute(destination);

  // fill needs both dimensions, or it does not keep the ratio
  const hasBoth = targetWidth && targetHeight;
  const pipeline = readImage(filepath).resize({
    width: targetWidth,
    height: targetHeight,
    fit: hasBoth ? 'fill' : 'inside',
    withoutEnlargement: !force,
  });
  await writeImage(pipeline, destinationPath, convert);
  return destinationPath;
}

__ = {
  /**
   * Throw if a width or height is not a positive number or percentage
   * @param {number|string} [value] Width or height to check
   **/
  assertSize(value) {
    if (_.isString(value) && !/^-?\d+(\.\d+)?%$/.test(value)) {
      throw firostError(
        'IMOEN_RESIZE_INVALID_SIZE_FORMAT',
        'resize width and height must be a number or a percentage',
      );
    }
    const number = _.isString(value) ? Number.parseFloat(value) : value;
    if (number <= 0) {
      throw firostError(
        'IMOEN_RESIZE_NON_POSITIVE_SIZE',
        'resize width and height must be positive',
      );
    }
  },
  /**
   * Convert the requested width and height to pixels, reading the upright
   * source size only when a percentage needs it
   * @param {string} filepath Path to the source image
   * @param {number|string} [width] Requested width, in pixels or percentage
   * @param {number|string} [height] Requested height, in pixels or percentage
   * @returns {object} The width and height in pixels
   **/
  async getTargetSize(filepath, width, height) {
    if (!_.isString(width) && !_.isString(height)) {
      return { width, height };
    }

    const source = await dimensions(filepath);
    let targetWidth = width;
    if (_.isString(width)) {
      targetWidth = __.percentToPixels(width, source.width);
    }
    let targetHeight = height;
    if (_.isString(height)) {
      targetHeight = __.percentToPixels(height, source.height);
    }
    return { width: targetWidth, height: targetHeight };
  },
  /**
   * Convert a percentage size to pixels
   * @param {string} value Size as a percentage (like '50%')
   * @param {number} reference Upright source size the percentage applies to
   * @returns {number} Size in pixels
   **/
  percentToPixels(value, reference) {
    return Math.max(
      1,
      Math.round((Number.parseFloat(value) / 100) * reference),
    );
  },
};
