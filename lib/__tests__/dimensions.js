const current = require('../main.js');
const emptyDir = require('firost/emptyDir');

describe('dimensions', () => {
  beforeEach(async () => {
    jest.spyOn(current, 'cacheDirectory').mockReturnValue('./tmp/dimensions');
    await emptyDir(current.cacheDirectory());
  });
  const expectedDimensions = {
    'picture.jpg': { width: 229, height: 240 },
    'picture.png': { width: 423, height: 570 },
  };
  it.each([
    ['fixtures/picture.jpg', expectedDimensions['picture.jpg']],
    ['fixtures/picture.png', expectedDimensions['picture.png']],
    ['fixtures/missing-file.jpg', false],
    [`${serverUrl}/picture.png`, expectedDimensions['picture.png']],
    [`${serverUrl}/picture.jpg`, expectedDimensions['picture.jpg']],
    [`${serverUrl}/missing-file.jpg`, false],
  ])('%s', async (input, expected) => {
    const actual = await current.dimensions(input);
    expect(actual).toEqual(expected);
  });
});
