import { emptyDirectory, packageRoot } from 'firost';
import { __ as config } from '../config.js';
import current from '../main.js';
import { __, semanticPalette } from '../semanticPalette.js';

describe('semanticPalette', () => {
  const mockCacheDirectory = `${packageRoot()}/tmp/semanticPalette`;
  beforeEach(async () => {
    vi.spyOn(config, 'getConfig').mockReturnValue({
      cacheDirectory: mockCacheDirectory,
      cache: {},
    });
    await emptyDirectory(mockCacheDirectory);
  });

  it('returns expected colors for flyer fixture', async () => {
    const actual = await semanticPalette('fixtures/flyer.jpg');

    expect(actual).toEqual({
      background: '#182350',
      text: '#e6791e',
      accent: '#e6791e',
      muted: '#8b9163',
    });
  });

  describe('extractVibrantColors', () => {
    it.each([
      {
        title: 'prefers Vibrant and Muted',
        clusters: [
          { color: '#e47c1c', count: 200 },
          { color: '#ff9999', count: 150 },
          { color: '#8c9463', count: 300 },
          { color: '#d0c8c0', count: 250 },
        ],
        expected: { accent: '#e47c1c', muted: '#8c9463' },
      },
      {
        title: 'falls back to the light and dark variants',
        clusters: [
          { color: '#ff9999', count: 150 },
          { color: '#d0c8c0', count: 250 },
        ],
        expected: { accent: '#ff9999', muted: '#d0c8c0' },
      },
      {
        title: 'returns null when nothing is colorful',
        clusters: [{ color: '#ffffff', count: 100 }],
        expected: { accent: null, muted: '#ffffff' },
      },
    ])('$title', ({ clusters, expected }) => {
      const actual = __.extractVibrantColors(clusters);

      expect(actual).toEqual(expected);
    });
  });

  it('returns false for non-existent path', async () => {
    const actual = await semanticPalette('fixtures/missing-file.jpg');

    expect(actual).toEqual(false);
  });

  it('is included in default export', async () => {
    const actual = await current('fixtures/flyer.jpg');

    expect(actual).toHaveProperty('semanticPalette');
  });
});
