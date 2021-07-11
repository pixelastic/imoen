const current = require('../hash.js');
const config = require('../config.js');
const emptyDir = require('firost/emptyDir');

describe('hash', () => {
  beforeEach(async () => {
    jest.spyOn(config, 'cacheDirectory').mockReturnValue('./tmp/lqip');
    await emptyDir(config.cacheDirectory());
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
