import { _ } from 'golgoth';

/**
 * Groups raw RGB pixel data into color clusters sorted by frequency.
 * Each channel is rounded to the nearest multiple of 32 to form buckets,
 * then the average actual RGB of each bucket's members is computed.
 * @param {Buffer} pixelBuffer - Raw RGB pixel buffer (3 bytes per pixel)
 * @returns {Array<{color: string, count: number}>} Clusters sorted by count descending
 */
export function bucketize(pixelBuffer) {
  const buckets = {};

  for (let i = 0; i < pixelBuffer.length; i += 3) {
    const r = pixelBuffer[i];
    const g = pixelBuffer[i + 1];
    const b = pixelBuffer[i + 2];

    const bucketR = Math.round(r / 32) * 32;
    const bucketG = Math.round(g / 32) * 32;
    const bucketB = Math.round(b / 32) * 32;
    const key = `${bucketR},${bucketG},${bucketB}`;

    if (!buckets[key]) {
      buckets[key] = { totalR: 0, totalG: 0, totalB: 0, count: 0 };
    }

    buckets[key].totalR += r;
    buckets[key].totalG += g;
    buckets[key].totalB += b;
    buckets[key].count += 1;
  }

  return _.chain(buckets)
    .map((bucket) => {
      const avgR = Math.round(bucket.totalR / bucket.count);
      const avgG = Math.round(bucket.totalG / bucket.count);
      const avgB = Math.round(bucket.totalB / bucket.count);
      return {
        color: toHex(avgR, avgG, avgB),
        count: bucket.count,
      };
    })
    .orderBy(['count'], ['desc'])
    .value();
}

/**
 * Convert RGB values to a hex color string
 * @param {number} r - Red channel (0-255)
 * @param {number} g - Green channel (0-255)
 * @param {number} b - Blue channel (0-255)
 * @returns {string} Hex color string like "#ff0000"
 */
function toHex(r, g, b) {
  const red = _.padStart(r.toString(16), 2, '0');
  const green = _.padStart(g.toString(16), 2, '0');
  const blue = _.padStart(b.toString(16), 2, '0');
  return `#${red}${green}${blue}`;
}
