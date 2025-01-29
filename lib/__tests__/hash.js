import { absolute, emptyDir } from 'firost';
import { hash as current } from '../hash.js';
import helper from '../helper.js';

describe('hash', () => {
  const mockCacheDirectory = absolute('<packageRoot>/tmp/hash');
  beforeEach(async () => {
    vi.spyOn(helper, 'cacheDirectory').mockReturnValue(mockCacheDirectory);
    await emptyDir(helper.cacheDirectory());
  });

  it('should return different hashes for different files', async () => {
    const hashOne = await current('fixtures/picture.jpg');
    const hashTwo = await current('fixtures/picture.png');

    expect(hashOne).not.toEqual(hashTwo);
  });
  it('should return same hash locally and remotely', async () => {
    const hashOne = await current('fixtures/picture.jpg');
    const hashTwo = await current(`${serverUrl}/picture.jpg`);

    expect(hashOne).toEqual(hashTwo);
  });
  it('should return same hash remotely even if url is different', async () => {
    const hashOne = await current(`${serverUrl}/picture.jpg`);
    const hashTwo = await current(`${serverUrl}/picture.jpg?something=true`);

    expect(hashOne).toEqual(hashTwo);
  });
});
