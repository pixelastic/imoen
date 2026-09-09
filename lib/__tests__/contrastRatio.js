import { contrastRatio } from '../contrastRatio.js';

describe('contrastRatio', () => {
  it.each([
    {
      title: 'Black vs white returns 21',
      hexA: '#000000',
      hexB: '#ffffff',
      expected: 21,
    },
    {
      title: 'Same color returns 1',
      hexA: '#abcdef',
      hexB: '#abcdef',
      expected: 1,
    },
    {
      title: 'Mid-range pair returns expected ratio',
      hexA: '#767676',
      hexB: '#ffffff',
      expected: 4.54,
    },
  ])('$title', ({ hexA, hexB, expected }) => {
    const actual = contrastRatio(hexA, hexB);
    expect(actual).toBeCloseTo(expected, 2);
  });

  it.each([
    {
      title: 'Lowercase hex',
      hexA: '#ff0000',
      hexB: '#000000',
    },
    {
      title: 'Uppercase hex',
      hexA: '#FF0000',
      hexB: '#000000',
    },
  ])('$title', ({ hexA, hexB }) => {
    const actual = contrastRatio(hexA, hexB);
    expect(actual).toBeGreaterThan(1);
  });

  it('returns same ratio regardless of argument order', () => {
    const actual1 = contrastRatio('#000000', '#ffffff');
    const actual2 = contrastRatio('#ffffff', '#000000');
    expect(actual1).toEqual(actual2);
  });
});
