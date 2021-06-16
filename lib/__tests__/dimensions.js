const current = require('../main.js');

describe('dimensions', () => {
  const expectedDimensions = {
    'picture.jpg': { width: 229, height: 240 },
    'picture.png': { width: 423, height: 570 },
  };
  it.each([
    ['fixtures/missing-file.jpg', false],
    ['fixtures/picture.jpg', expectedDimensions['picture.jpg']],
    ['fixtures/picture.png', expectedDimensions['picture.png']],
  ])('%s', async (input, expected) => {
    const actual = await current.dimensions(input);
    expect(actual).toEqual(expected);
  });
});
