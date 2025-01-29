import normalizeTarget from './normalizeTarget.js';
import dimensions from './dimensions.js';
import getLqip from './lqip.js';
import getHash from './hash.js';
import getFilesize from './filesize.js';

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

export default imoen;
