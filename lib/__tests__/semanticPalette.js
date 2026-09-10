import { emptyDirectory, packageRoot } from 'firost';
import helper from '../helper.js';
import current from '../main.js';
import { __, semanticPalette } from '../semanticPalette.js';

describe('semanticPalette', () => {
  const mockCacheDirectory = `${packageRoot()}/tmp/semanticPalette`;
  beforeEach(async () => {
    vi.spyOn(helper, 'cacheDirectory').mockReturnValue(mockCacheDirectory);
    await emptyDirectory(helper.cacheDirectory());
  });

  it('returns expected colors for flyer fixture', async () => {
    const actual = await semanticPalette('fixtures/flyer.jpg');

    expect(actual).toEqual({
      background: '#182350',
      text: '#e6791e',
      accent: '#e47c1c',
      muted: '#8c9463',
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
