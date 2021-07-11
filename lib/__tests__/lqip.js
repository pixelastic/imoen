const current = require('../lqip.js');
const config = require('../config.js');
const emptyDir = require('firost/emptyDir');

describe('lqip', () => {
  beforeEach(async () => {
    jest.spyOn(config, 'cacheDirectory').mockReturnValue('./tmp/lqip');
    await emptyDir(config.cacheDirectory());
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
      }
    );
  });
});
