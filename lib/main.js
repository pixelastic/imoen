import { colorCount } from './colorCount.js';
import { contrastRatio } from './contrastRatio.js';
import { dimensions } from './dimensions.js';
import { filesize } from './filesize.js';
import { hash } from './hash.js';
import { lqip } from './lqip.js';
import { normalizeTarget } from './normalizeTarget.js';
import { semanticPalette } from './semanticPalette.js';

export { colorCount as colorCount };
export { contrastRatio as contrastRatio };
export { dimensions as dimensions };
export { filesize as filesize };
export { hash as hash };
export { lqip as lqip };
export { semanticPalette as semanticPalette };

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
    semanticPalette: await semanticPalette(filepath),
  };
};
