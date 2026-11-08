import { absolute } from 'firost';
import { readImage } from '../readImage.js';

describe('readImage', () => {
  const input = absolute('../../fixtures/orientation.jpg');
  let data;
  let info;
  beforeEach(async () => {
    ({ data, info } = await readImage(input)
      .raw()
      .toBuffer({ resolveWithObject: true }));
  });

  // Name the color of a pixel, tolerating JPEG compression noise
  const getColor = (x, y) => {
    const offset = (y * info.width + x) * info.channels;
    const [red, , blue] = data.subarray(offset, offset + 3);
    return red > blue ? 'red' : 'blue';
  };

  it('returns an upright image', () => {
    const actual = { width: info.width, height: info.height };
    const expected = { width: 20, height: 40 };
    expect(actual).toEqual(expected);
  });
  it.each([
    { title: 'top right is red', x: 19, y: 0, expected: 'red' },
    { title: 'top left is blue', x: 0, y: 0, expected: 'blue' },
    { title: 'bottom right is blue', x: 19, y: 39, expected: 'blue' },
    { title: 'bottom left is blue', x: 0, y: 39, expected: 'blue' },
  ])('$title', ({ x, y, expected }) => {
    const actual = getColor(x, y);
    expect(actual).toEqual(expected);
  });
});
