import { getConfig } from '../config.js';

describe('getConfig', () => {
  it('returns a cache directory named imoen', () => {
    const actual = getConfig().cacheDirectory;
    expect(actual).toMatch(/\/imoen$/);
  });
  it('returns the same cache object on each call', () => {
    const actual = getConfig().cache;
    const expected = getConfig().cache;
    expect(actual).toBe(expected);
  });
});
