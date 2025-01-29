import { absolute, emptyDir } from 'firost';
import current from '../main.js';
import helper from '../helper.js';

describe('imoen', () => {
  const mockCacheDirectory = absolute('<packageRoot>/tmp/main');
  beforeEach(async () => {
    vi.spyOn(helper, 'cacheDirectory').mockReturnValue(mockCacheDirectory);
    await emptyDir(helper.cacheDirectory());
  });
  const expecteds = {
    'picture.jpg': {
      width: 229,
      height: 240,
      mimetype: 'image/jpg',
      filesize: 36864,
      hash: '7ed924bc89',
    },
    'picture.png': {
      width: 423,
      height: 570,
      mimetype: 'image/png',
      filesize: 209058,
      hash: 'd0e9d0d9d0',
    },
  };

  it.each([
    ['fixtures/picture.jpg', expecteds['picture.jpg']],
    ['fixtures/picture.png', expecteds['picture.png']],
    [`${serverUrl}/picture.jpg`, expecteds['picture.jpg']],
    [`${serverUrl}/picture.png`, expecteds['picture.png']],
    [`${serverUrl}/picture.png?something=true`, expecteds['picture.png']],
  ])('%s', async (input, expected) => {
    const actual = await current(input);

    expect(actual).toHaveProperty('width', expected.width);
    expect(actual).toHaveProperty('height', expected.height);
    expect(actual).toHaveProperty('filesize', expected.filesize);
    expect(actual).toHaveProperty('hash', expected.hash);
    expect(actual.lqip).toStartWith(`data:${expected.mimetype};base64,`);
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
