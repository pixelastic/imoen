import { emptyDir } from 'firost';
import { dimensions as current } from '../dimensions.js';
import helper from '../helper.js';

describe('dimensions', () => {
  beforeEach(async () => {
    vi.spyOn(helper, 'cacheDirectory').mockReturnValue('./tmp/dimensions');
    await emptyDir(helper.cacheDirectory());
  });
  const expectedDimensions = {
    'picture.jpg': { width: 229, height: 240 },
    'picture.png': { width: 423, height: 570 },
  };
  it.each([
    ['fixtures/picture.jpg', expectedDimensions['picture.jpg']],
    ['fixtures/picture.png', expectedDimensions['picture.png']],
    ['fixtures/missing-file.jpg', false],
    // [`${serverUrl}/picture.png`, expectedDimensions['picture.png']],
    // [`${serverUrl}/picture.jpg`, expectedDimensions['picture.jpg']],
    // [`${serverUrl}/missing-file.jpg`, false],
  ])('%s', async (input, expected) => {
    const actual = await current(input);
    expect(actual).toEqual(expected);
  });
});
