import { absolute, emptyDirectory, packageRoot, write } from 'firost';
import { isImageValid } from '../isImageValid.js';

describe('isImageValid', () => {
  const testDirectory = `${packageRoot()}/tmp/isImageValid`;
  beforeEach(async () => {
    await emptyDirectory(testDirectory);
  });

  it('returns true for an image', async () => {
    const input = absolute('../../fixtures/picture.jpg');
    const actual = await isImageValid(input);
    expect(actual).toEqual(true);
  });
  it('returns false for a file that is not an image', async () => {
    const input = `${testDirectory}/bad.jpg`;
    await write('bad image', input);
    const actual = await isImageValid(input);
    expect(actual).toEqual(false);
  });
});
