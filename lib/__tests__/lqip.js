import { emptyDirectory, packageRoot } from 'firost';
import sharp from 'sharp';
import { __ as config } from '../config.js';
import { lqip as current } from '../lqip.js';

describe('lqip', () => {
  const mockCacheDirectory = `${packageRoot()}/tmp/lqip`;
  beforeEach(async () => {
    vi.spyOn(config, 'getConfig').mockReturnValue({
      cacheDirectory: mockCacheDirectory,
      cache: {},
    });
    await emptyDirectory(mockCacheDirectory);
  });
  const maxSize = {
    'picture.jpg': 494,
    'picture.png': 1154,
  };
  it.each([
    ['fixtures/picture.jpg', maxSize['picture.jpg']],
    ['fixtures/picture.png', maxSize['picture.png']],
    [`${serverUrl}/picture.jpg`, maxSize['picture.jpg']],
    [`${serverUrl}/picture.png`, maxSize['picture.png']],
  ])('%s', async (input, expected) => {
    const actual = (await current(input)).length;
    expect(actual).toBeLessThanOrEqual(expected);
  });
  describe('EXIF orientation', () => {
    it('is upright, with the red corner at the top right', async () => {
      const input = 'fixtures/orientation.jpg';
      const base64 = (await current(input)).split(',')[1];
      const { data, info } = await sharp(Buffer.from(base64, 'base64'))
        .raw()
        .toBuffer({ resolveWithObject: true });
      const offset = (info.width - 1) * info.channels;
      const [red, , blue] = data.subarray(offset, offset + 3);

      const actual = {
        isPortrait: info.height > info.width,
        isTopRightRed: red > blue,
      };
      const expected = { isPortrait: true, isTopRightRed: true };
      expect(actual).toEqual(expected);
    });
  });
  describe('missing files', () => {
    it.each([['fixtures/missing-file.jpg'], [`${serverUrl}/missing-file.jpg`]])(
      '%s',
      async (input) => {
        const actual = await current(input);
        expect(actual).toEqual(false);
      },
    );
  });
});
