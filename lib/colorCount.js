import sharp from 'sharp';
import { _ } from 'golgoth';
import { normalizeTarget } from './normalizeTarget.js';

/**
 * Returns the count of unique colors in the image
 * @param {string} target URL or filepath to the image
 * @returns {number} Number of unique colors
 **/
export async function colorCount(target) {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const colors = {};
  const { data } = await sharp(filepath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    // Skip transparent pixels
    const alpha = data[i + 3];
    if (alpha != 255) {
      continue;
    }

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${r},${g},${b}`;
    colors[key] = colors[key] ? colors[key] + 1 : 1;
  }

  return _.chain(colors).keys().get('length').value();
}
