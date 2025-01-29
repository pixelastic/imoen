import { absolute, emptyDir } from 'firost';
import { lqip as current } from '../lqip.js';
import helper from '../helper.js';

describe('lqip', () => {
  const mockCacheDirectory = absolute('<packageRoot>/tmp/lqip');
  beforeEach(async () => {
    vi.spyOn(helper, 'cacheDirectory').mockReturnValue(mockCacheDirectory);
    await emptyDir(helper.cacheDirectory());
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
