import { bucketize } from '../bucketize.js';

/**
 * Build a raw RGB pixel buffer from an array of [r, g, b] triples
 * @param {Array<[number, number, number]>} pixels - Array of RGB triples
 * @returns {Buffer} Raw pixel buffer
 */
function buildBuffer(pixels) {
  const flat = pixels.flatMap(([r, g, b]) => [r, g, b]);
  return Buffer.from(flat);
}

describe('bucketize', () => {
  it('uniform color buffer returns a single cluster', () => {
    const input = buildBuffer(Array(10).fill([255, 0, 0]));

    const actual = bucketize(input);

    expect(actual).toEqual([{ color: '#ff0000', count: 10 }]);
  });

  it('two-color buffer returns clusters sorted by count descending', () => {
    const redPixels = Array(7).fill([255, 0, 0]);
    const bluePixels = Array(3).fill([0, 0, 255]);
    const input = buildBuffer([...redPixels, ...bluePixels]);

    const actual = bucketize(input);

    expect(actual).toEqual([
      { color: '#ff0000', count: 7 },
      { color: '#0000ff', count: 3 },
    ]);
  });

  it('similar colors within step 32 merge into one cluster', () => {
    const lightRed = Array(5).fill([240, 0, 0]);
    const darkerRed = Array(5).fill([250, 0, 0]);
    const input = buildBuffer([...lightRed, ...darkerRed]);

    const actual = bucketize(input);

    expect(actual).toHaveLength(1);
    expect(actual).toHaveProperty('0.count', 10);
    expect(actual).toHaveProperty('0.color', '#f50000');
  });
});
