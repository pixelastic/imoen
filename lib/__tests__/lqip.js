import { emptyDirectory, packageRoot } from 'firost';
import helper from '../helper.js';
import { lqip as current } from '../lqip.js';

describe('lqip', () => {
  const mockCacheDirectory = `${packageRoot()}/tmp/lqip`;
  beforeEach(async () => {
    vi.spyOn(helper, 'cacheDirectory').mockReturnValue(mockCacheDirectory);
    await emptyDirectory(helper.cacheDirectory());
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
