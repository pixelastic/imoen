const normalizeTarget = require('./normalizeTarget');
const dimensions = require('./dimensions');
const getLqip = require('./lqip');
const getHash = require('./hash');
const getFilesize = require('./filesize');

const imoen = async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const { width, height } = await dimensions(filepath);
  const lqip = await getLqip(filepath);
  const filesize = await getFilesize(filepath);
  const hash = await getHash(filepath);
  return {
    width,
    height,
    lqip,
    filesize,
    hash,
  };
};

imoen.dimensions = dimensions;
imoen.filesize = getFilesize;
imoen.hash = getHash;
imoen.lqip = getLqip;

module.exports = imoen;
