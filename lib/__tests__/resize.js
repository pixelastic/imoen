import { absolute, copy, emptyDirectory, exists, packageRoot } from 'firost';
import sharp from 'sharp';
import { __ as config } from '../config.js';
import { resize as current } from '../resize.js';

describe('resize', () => {
  const mockCacheDirectory = `${packageRoot()}/tmp/resize`;
  const testDirectory = `${packageRoot()}/tmp/resize-output`;
  beforeEach(async () => {
    vi.spyOn(config, 'getConfig').mockReturnValue({
      cacheDirectory: mockCacheDirectory,
      cache: {},
    });
    await emptyDirectory(mockCacheDirectory);
    await emptyDirectory(testDirectory);
  });

  const getMetadata = async (filepath) => sharp(filepath).metadata();
  const getSize = async (filepath) => {
    const { width, height } = await getMetadata(filepath);
    return { width, height };
  };

  // picture.jpg is 229x240, flyer.jpg is 800x600
  it.each([
    {
      title: 'a width, keeping the ratio',
      source: 'fixtures/flyer.jpg',
      options: { width: 400 },
      expected: { width: 400, height: 300 },
    },
    {
      title: 'a height, keeping the ratio',
      source: 'fixtures/flyer.jpg',
      options: { height: 300 },
      expected: { width: 400, height: 300 },
    },
    {
      title: 'both, stretching to the exact dimensions',
      source: 'fixtures/flyer.jpg',
      options: { width: 100, height: 100 },
      expected: { width: 100, height: 100 },
    },
    {
      title: 'a width larger than the source, without enlarging',
      source: 'fixtures/picture.jpg',
      options: { width: 1000 },
      expected: { width: 229, height: 240 },
    },
    {
      title: 'a height larger than the source, without enlarging',
      source: 'fixtures/picture.jpg',
      options: { height: 1000 },
      expected: { width: 229, height: 240 },
    },
    {
      title: 'both larger than the source, without enlarging',
      source: 'fixtures/picture.jpg',
      options: { width: 1000, height: 1000 },
      expected: { width: 229, height: 240 },
    },
  ])('resizes to $title', async ({ source, options, expected }) => {
    const destination = `${testDirectory}/output.jpg`;
    await current(source, destination, options);

    const actual = await getSize(destination);
    expect(actual).toEqual(expected);
  });

  it.each([
    { title: 'png', extension: 'png', expected: 'png' },
    { title: 'webp', extension: 'webp', expected: 'webp' },
    { title: 'jpg', extension: 'jpg', expected: 'jpeg' },
  ])(
    'uses the $title destination extension as format',
    async ({ extension, expected }) => {
      const destination = `${testDirectory}/output.${extension}`;
      await current('fixtures/flyer.jpg', destination, { width: 100 });

      const { format } = await getMetadata(destination);
      expect(format).toEqual(expected);
    },
  );

  it('works with a URL source', async () => {
    const destination = `${testDirectory}/url.jpg`;
    await current(`${serverUrl}/picture.jpg`, destination, { width: 100 });

    const { width } = await getMetadata(destination);
    expect(width).toEqual(100);
  });

  it('works in place', async () => {
    const destination = `${testDirectory}/in-place.jpg`;
    await copy(absolute('../fixtures/flyer.jpg'), destination);

    await current(destination, destination, { width: 100 });

    const { width } = await getMetadata(destination);
    expect(width).toEqual(100);
  });

  it('returns the absolute destination path', async () => {
    const destination = `${testDirectory}/output.jpg`;
    const actual = await current('fixtures/flyer.jpg', destination, {
      width: 100,
    });
    expect(actual).toEqual(destination);
  });

  it.each([
    { title: 'path', input: 'fixtures/missing-file.jpg' },
    { title: 'URL', input: `${serverUrl}/missing-file.jpg` },
  ])(
    'returns false and writes nothing for a missing $title',
    async ({ input }) => {
      const destination = `${testDirectory}/missing.jpg`;
      const actual = await current(input, destination, { width: 100 });

      expect(actual).toEqual(false);
      expect(await exists(destination)).toEqual(false);
    },
  );

  it.each([
    {
      title: 'no option',
      options: undefined,
      expected: 'resize requires a width or a height',
    },
    {
      title: 'empty options',
      options: {},
      expected: 'resize requires a width or a height',
    },
    {
      title: 'a zero width',
      options: { width: 0 },
      expected: 'resize width and height must be positive',
    },
    {
      title: 'a negative width',
      options: { width: -10 },
      expected: 'resize width and height must be positive',
    },
    {
      title: 'a zero height',
      options: { height: 0 },
      expected: 'resize width and height must be positive',
    },
    {
      title: 'a negative height',
      options: { height: -10 },
      expected: 'resize width and height must be positive',
    },
    {
      title: 'a valid width and a negative height',
      options: { width: 100, height: -10 },
      expected: 'resize width and height must be positive',
    },
  ])('throws for $title', async ({ options, expected }) => {
    let actual = null;
    try {
      await current(
        'fixtures/flyer.jpg',
        `${testDirectory}/output.jpg`,
        options,
      );
    } catch (error) {
      actual = error;
    }
    expect(actual).toHaveProperty('message', expected);
    expect(await exists(`${testDirectory}/output.jpg`)).toEqual(false);
  });

  it('outputs an upright image for an EXIF-rotated source', async () => {
    const destination = `${testDirectory}/orientation.png`;
    await current('fixtures/orientation.jpg', destination, { width: 10 });

    const { data, info } = await sharp(destination)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const offset = (info.width - 1) * info.channels;
    const [red, , blue] = data.subarray(offset, offset + 3);

    const actual = {
      size: { width: info.width, height: info.height },
      isTopRightRed: red > blue,
    };
    const expected = { size: { width: 10, height: 20 }, isTopRightRed: true };
    expect(actual).toEqual(expected);
  });
});
