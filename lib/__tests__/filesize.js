const current = require('../main.js');
const emptyDir = require('firost/emptyDir');

describe('filesize', () => {
  beforeEach(async () => {
    jest.spyOn(current, 'cacheDirectory').mockReturnValue('./tmp/filesize');
    await emptyDir(current.cacheDirectory());
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
    const actual = await current.filesize(input);
    expect(actual).toEqual(expected);
  });
  describe('missing files', () => {
    it.each([['fixtures/missing-file.jpg'], [`${serverUrl}/missing-file.jpg`]])(
      '%s',
      async (input) => {
        const actual = await current.filesize(input);
        expect(actual).toEqual(0);
      }
    );
  });
});
