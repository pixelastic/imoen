import fs from 'node:fs/promises';
import { absolute, copy, emptyDirectory, exists, packageRoot } from 'firost';
import sharp from 'sharp';
import { __ as config } from '../config.js';
import { convert as current } from '../convert.js';

describe('convert', () => {
  const mockCacheDirectory = `${packageRoot()}/tmp/convert`;
  const testDirectory = `${packageRoot()}/tmp/convert-output`;
  beforeEach(async () => {
    vi.spyOn(config, 'getConfig').mockReturnValue({
      cacheDirectory: mockCacheDirectory,
      cache: {},
    });
    await emptyDirectory(mockCacheDirectory);
    await emptyDirectory(testDirectory);
  });

  const getFormat = async (filepath) =>
    (await sharp(filepath).metadata()).format;
  const getSize = async (filepath) => (await fs.stat(filepath)).size;

  it.each([
    { title: 'png', extension: 'png', expected: 'png' },
    { title: 'webp', extension: 'webp', expected: 'webp' },
    { title: 'jpg', extension: 'jpg', expected: 'jpeg' },
    { title: 'jpeg', extension: 'jpeg', expected: 'jpeg' },
  ])('converts a JPEG to $title', async ({ extension, expected }) => {
    const destination = `${testDirectory}/output.${extension}`;
    await current('fixtures/picture.jpg', destination);

    const actual = await getFormat(destination);
    expect(actual).toEqual(expected);
  });

  it('gives the same output for .jpg and .jpeg', async () => {
    await current('fixtures/picture.jpg', `${testDirectory}/a.jpg`);
    await current('fixtures/picture.jpg', `${testDirectory}/b.jpeg`);

    const actual = await fs.readFile(`${testDirectory}/a.jpg`);
    const expected = await fs.readFile(`${testDirectory}/b.jpeg`);
    expect(actual.equals(expected)).toEqual(true);
  });

  it('passes the format options', async () => {
    await current('fixtures/picture.jpg', `${testDirectory}/low.jpg`, {
      quality: 10,
    });
    await current('fixtures/picture.jpg', `${testDirectory}/high.jpg`, {
      quality: 90,
    });

    const lowSize = await getSize(`${testDirectory}/low.jpg`);
    const highSize = await getSize(`${testDirectory}/high.jpg`);
    expect(lowSize).toBeLessThan(highSize);
  });

  it('works with a URL source', async () => {
    const destination = `${testDirectory}/url.png`;
    await current(`${serverUrl}/picture.jpg`, destination);

    const actual = await getFormat(destination);
    expect(actual).toEqual('png');
  });

  it('works in place', async () => {
    const destination = `${testDirectory}/in-place.jpg`;
    await copy(absolute('../fixtures/picture.jpg'), destination);
    const sizeBefore = await getSize(destination);

    await current(destination, destination, { quality: 10 });

    const sizeAfter = await getSize(destination);
    expect(sizeAfter).toBeLessThan(sizeBefore);
  });

  it('returns the absolute destination path', async () => {
    const destination = `${testDirectory}/output.png`;
    const actual = await current('fixtures/picture.jpg', destination);
    expect(actual).toEqual(destination);
  });

  it('returns an absolute path for a relative destination', async () => {
    const actual = await current(
      'fixtures/picture.jpg',
      'tmp/convert-output/relative.png',
    );
    const expected = `${testDirectory}/relative.png`;
    expect(actual).toEqual(expected);
  });

  it.each([
    { title: 'path', input: 'fixtures/missing-file.jpg' },
    { title: 'URL', input: `${serverUrl}/missing-file.jpg` },
  ])(
    'returns false and writes nothing for a missing $title',
    async ({ input }) => {
      const destination = `${testDirectory}/missing.png`;
      const actual = await current(input, destination);

      expect(actual).toEqual(false);
      expect(await exists(destination)).toEqual(false);
    },
  );

  it('throws for an unwritable extension', async () => {
    let actual = null;
    try {
      await current('fixtures/picture.jpg', `${testDirectory}/output.txt`);
    } catch (error) {
      actual = error;
    }
    expect(actual).toHaveProperty('message');
    expect(actual.message).toContain('txt');
  });

  describe('orientation.jpg', () => {
    it('is upright, with the red corner at the top right', async () => {
      const destination = `${testDirectory}/orientation.png`;
      await current('fixtures/orientation.jpg', destination);

      const { data, info } = await sharp(destination)
        .raw()
        .toBuffer({ resolveWithObject: true });
      const offset = (info.width - 1) * info.channels;
      const [red, , blue] = data.subarray(offset, offset + 3);

      const actual = {
        isPortrait: info.height > info.width,
        isTopRightRed: red > blue,
      };
      const expected = { isPortrait: true, isTopRightRed: true };
      expect(actual).toEqual(expected);
    });
    it('has no orientation metadata left', async () => {
      const destination = `${testDirectory}/orientation.jpg`;
      await current('fixtures/orientation.jpg', destination);

      const { orientation } = await sharp(destination).metadata();
      expect(orientation).toBeUndefined();
    });
  });
});
