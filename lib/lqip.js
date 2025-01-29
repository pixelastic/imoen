import path from 'node:path';
import sharp from 'sharp';
import { normalizeTarget } from './normalizeTarget.js';

/**
 * Returns a base64 encoded string of an image LQIP (Low Quality Image
 * Placeholder)
 * @param {string} target URL or filepath to the image
 * @returns {string|boolean} Base64 encoded string of the image LQIP, or false
 * if no such file
 **/
export async function lqip(target) {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const extname = path.extname(filepath).replace('.', '');

  const image = sharp(filepath);
  const buffer = await image.resize(16, 16, { fit: 'inside' }).toBuffer();
  const base64 = buffer.toString('base64');

  return `data:image/${extname};base64,${base64}`;
}
