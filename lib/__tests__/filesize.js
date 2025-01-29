import { absolute, emptyDir } from 'firost';
import { filesize as current } from '../filesize.js';
import helper from '../helper.js';

describe('filesize', () => {
  const mockCacheDirectory = absolute('<packageRoot>/tmp/filesize');
  beforeEach(async () => {
    vi.spyOn(helper, 'cacheDirectory').mockReturnValue(mockCacheDirectory);
    await emptyDir(helper.cacheDirectory());
  });
  const filesizes = {
    'picture.jpg': 36864,
    'picture.png': 209058,
  };
  it.each([
    ['fixtures/picture.jpg', filesizes['picture.jpg']],
    ['fixtures/picture.png', filesizes['picture.png']],
    [`${serverUrl}/picture.jpg`, filesizes['picture.jpg']],
    [`${serverUrl}/picture.png`, filesizes['picture.png']],
  ])('%s', async (input, expected) => {
    const actual = await current(input);
    expect(actual).toEqual(expected);
  });
  describe('missing files', () => {
    it.each([['fixtures/missing-file.jpg'], [`${serverUrl}/missing-file.jpg`]])(
      '%s',
      async (input) => {
        const actual = await current(input);
        expect(actual).toEqual(0);
      },
    );
  });
});
