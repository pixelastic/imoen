import fs from 'node:fs/promises';
import { absolute, remove, tmpDirectory } from 'firost';
import sharp from 'sharp';
import { readImage } from '../readImage.js';
import { writeImage } from '../writeImage.js';

describe('writeImage', () => {
  const input = absolute('../../fixtures/picture.jpg');
  let testDirectory;
  beforeEach(() => {
    testDirectory = tmpDirectory('imoen/writeImage');
  });
  afterEach(async () => {
    await remove(testDirectory);
  });

  it.each([
    { extension: 'png', expected: 'png' },
    { extension: 'webp', expected: 'webp' },
    { extension: 'jpg', expected: 'jpeg' },
    { extension: 'jpeg', expected: 'jpeg' },
  ])('writes a $expected from .$extension', async ({ extension, expected }) => {
    const destination = `${testDirectory}/output.${extension}`;
    await writeImage(readImage(input), destination);

    const actual = (await sharp(destination).metadata()).format;
    expect(actual).toEqual(expected);
  });

  it('applies the options to the format method', async () => {
    const lowQuality = `${testDirectory}/low.jpg`;
    const highQuality = `${testDirectory}/high.jpg`;
    await writeImage(readImage(input), lowQuality, { quality: 10 });
    await writeImage(readImage(input), highQuality, { quality: 90 });

    const actual = (await fs.stat(lowQuality)).size;
    const expected = (await fs.stat(highQuality)).size;
    expect(actual).toBeLessThan(expected);
  });

  it('creates missing directories', async () => {
    const destination = `${testDirectory}/nested/deep/output.png`;
    await writeImage(readImage(input), destination);

    const actual = (await sharp(destination).metadata()).format;
    expect(actual).toEqual('png');
  });

  it('throws for an extension sharp cannot write', async () => {
    let actual = null;
    try {
      await writeImage(readImage(input), `${testDirectory}/output.txt`);
    } catch (error) {
      actual = error;
    }
    expect(actual).toHaveProperty('message');
    expect(actual.message).toContain('txt');
  });
});
