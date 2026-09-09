import { colorCount } from './colorCount.js';
import { dimensions } from './dimensions.js';
import { filesize } from './filesize.js';
import { hash } from './hash.js';
import { lqip } from './lqip.js';
import { normalizeTarget } from './normalizeTarget.js';

export { dimensions as dimensions };
export { colorCount as colorCount };
export { lqip as lqip };
export { filesize as filesize };
export { hash as hash };

export default async (target) => {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const { width, height } = await dimensions(filepath);
  return {
    width,
    height,
    lqip: await lqip(filepath),
    filesize: await filesize(filepath),
    hash: await hash(filepath),
  };
};
