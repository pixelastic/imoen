const current = require('../main.js');
const config = require('../config.js');
const emptyDir = require('firost/emptyDir');

describe('imoen', () => {
  beforeEach(async () => {
    jest.spyOn(config, 'cacheDirectory').mockReturnValue('./tmp/main');
    await emptyDir(config.cacheDirectory());
  });
  it.each([
    [
      'fixtures/picture.jpg',
      { width: 229, height: 240, mimetype: 'image/jpg' },
    ],
    [
      'fixtures/picture.png',
      { width: 423, height: 570, mimetype: 'image/png' },
    ],
    [
      `${serverUrl}/picture.jpg`,
      { width: 229, height: 240, mimetype: 'image/jpg' },
    ],
    [
      `${serverUrl}/picture.png`,
      { width: 423, height: 570, mimetype: 'image/png' },
    ],
    [
      `${serverUrl}/picture.png?width=640`,
      { width: 423, height: 570, mimetype: 'image/png' },
    ],
  ])('%s', async (input, expected) => {
    const actual = await current(input);

    expect(actual).toHaveProperty('width', expected.width);
    expect(actual).toHaveProperty('height', expected.height);
    expect(actual.lqip).toStartWith(`data:${expected.mimetype};base64,`);
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
