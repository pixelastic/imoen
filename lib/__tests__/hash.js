import { emptyDirectory, packageRoot } from 'firost';
import { __ as config } from '../config.js';
import { hash as current } from '../hash.js';

describe('hash', () => {
  const mockCacheDirectory = `${packageRoot()}/tmp/hash`;
  beforeEach(async () => {
    vi.spyOn(config, 'getConfig').mockReturnValue({
      cacheDirectory: mockCacheDirectory,
      cache: {},
    });
    await emptyDirectory(mockCacheDirectory);
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
