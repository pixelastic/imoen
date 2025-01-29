import { absolute, emptyDir, exists, newFile, write } from 'firost';
import { normalizeTarget as current } from '../normalizeTarget.js';
import helper from '../helper.js';
import { hash } from '../hash.js';

describe('normalizeTarget', () => {
  const mockCacheDirectory = absolute('<packageRoot>/tmp/normalizeTarget');
  let pictureUrl = `${serverUrl}/picture.jpg`;
  beforeEach(async () => {
    vi.spyOn(helper, 'cacheDirectory').mockReturnValue(mockCacheDirectory);
    await emptyDir(helper.cacheDirectory());
  });

  it('returns false if the url does not resolve', async () => {
    const actual = await current(`${serverUrl}/missing-file.jpg`);
    expect(actual).toEqual(false);
  });
  it('downloads the file on disk', async () => {
    const filepath = await current(pictureUrl);

    const actual = await exists(filepath);
    expect(actual).toEqual(true);
  });

  it('do not re-download if the file already exists', async () => {
    const filepath = await current(pictureUrl);

    // Put another file in place
    await newFile(filepath);
    const expectedFileHash = await hash(filepath);

    // Attempt a download
    await current(pictureUrl);

    const actual = await hash(filepath);
    expect(actual).toEqual(expectedFileHash);
  });
  it('re-downloads if the file is empty', async () => {
    const filepath = await current(pictureUrl);
    const expectedFileHash = await hash(filepath);

    // Put an empty file in place
    await write('', filepath);

    // Attempt a download
    await current(pictureUrl);

    const actual = await hash(filepath);
    expect(actual).toEqual(expectedFileHash);
  });
  it('re-downloads if the image is corrupted', async () => {
    const filepath = await current(pictureUrl);
    const expectedFileHash = await hash(filepath);

    // Put a bad image format in place
    await write('bad image', filepath);

    // Attempt a download
    await current(pictureUrl);

    const actual = await hash(filepath);
    expect(actual).toEqual(expectedFileHash);
  });
});
