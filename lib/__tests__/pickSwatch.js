import { pickSwatch } from '../pickSwatch.js';

describe('pickSwatch', () => {
  const clusters = [
    { color: '#e47c1c', count: 200 },
    { color: '#ff9999', count: 150 },
    { color: '#400080', count: 100 },
    { color: '#8c9463', count: 300 },
    { color: '#d0c8c0', count: 250 },
    { color: '#3a3836', count: 400 },
  ];

  it.each([
    { role: 'Vibrant', expected: '#e47c1c' },
    { role: 'LightVibrant', expected: '#ff9999' },
    { role: 'DarkVibrant', expected: '#400080' },
    { role: 'Muted', expected: '#8c9463' },
    { role: 'LightMuted', expected: '#d0c8c0' },
    { role: 'DarkMuted', expected: '#3a3836' },
  ])('picks the matching cluster for $role', ({ role, expected }) => {
    const actual = pickSwatch(clusters, role);

    expect(actual).toEqual(expected);
  });

  it('returns null when no cluster fits the role', () => {
    const grays = [
      { color: '#808080', count: 10 },
      { color: '#303030', count: 5 },
    ];

    const actual = pickSwatch(grays, 'Vibrant');

    expect(actual).toEqual(null);
  });

  it('prefers the more populated cluster when two fit equally', () => {
    const twins = [
      { color: '#e47c1c', count: 10 },
      { color: '#e47c1d', count: 90 },
    ];

    const actual = pickSwatch(twins, 'Vibrant');

    expect(actual).toEqual('#e47c1d');
  });
});
