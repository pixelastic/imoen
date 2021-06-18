const current = require('../main.js');

describe('imoen', () => {
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
  ])('%s', async (input, expected) => {
    const actual = await current(input);

    expect(actual).toHaveProperty('width', expected.width);
    expect(actual).toHaveProperty('height', expected.height);
    expect(actual.base64).toStartWith(`data:${expected.mimetype};base64,`);
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
