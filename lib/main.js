const normalizeTarget = require('./normalizeTarget');
const dimensions = require('./dimensions');
const getLqip = require('./lqip');
const getFilesize = require('./filesize');

module.exports = async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const { width, height } = await dimensions(filepath);
  const lqip = await getLqip(filepath);
  const filesize = getFilesize(filepath);
  return {
    width,
    height,
    lqip,
    filesize,
  };
};
