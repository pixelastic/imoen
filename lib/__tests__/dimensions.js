const current = require('../dimensions.js');
const config = require('../config.js');
const emptyDir = require('firost/emptyDir');

describe('dimensions', () => {
  beforeEach(async () => {
    jest.spyOn(config, 'cacheDirectory').mockReturnValue('./tmp/dimensions');
    await emptyDir(config.cacheDirectory());
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
    const actual = await current(input);
    expect(actual).toEqual(expected);
  });
});
