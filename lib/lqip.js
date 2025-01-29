import path from 'path';
import sharp from 'sharp';
import normalizeTarget from './normalizeTarget.js';

/**
 * Returns a base64 encoded string of an image LQIP
 * @param {string} target URL or filepath to the image
 * @returns {string|boolean} Base64 encoded string of the image LQIP, or false
 * if no such file
 **/
export default async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const extname = path.extname(filepath).replace('.', '');

  const image = sharp(filepath);
  const buffer = await image.resize(16, 16, { fit: 'inside' }).toBuffer();
  const lqip = buffer.toString('base64');

  return `data:image/${extname};base64,${lqip}`;
};
