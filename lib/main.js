const path = require('path');
const sharp = require('sharp');

// const PLACEHOLDER_MAX_DIMENSION = 8;

module.exports = {
  // Norska is using sharp for the dimensions and resizeo
  //
  // const image = sharp(filepath);
  // const { width, height } = await image.metadata();

  // const buffer = await image
  //   .resize(PLACEHOLDER_MAX_DIMENSION, PLACEHOLDER_MAX_DIMENSION, {
  //     fit: 'inside',
  //   })
  //   .toBuffer();
  // const extname = _.trim(path.extname(filepath), '.');
  // const base64Prefix = `data:image/${extname};`;
  // const base64Lqip = `${base64Prefix};base64,${buffer.toString('base64')}`;
  //
  // dungeons is using imagesize for the size and imagemagick for the lqip
  // same for monsters
  //
  // const convertOptions = [
  //   '-resize 16', // Small enough it retains some shape
  //   '-define png:compression-filter=5', // Reorganize data so compression is more efficient
  //   '-define png:compression-level=9', // Max compression
  //   '-define png:compression-strategy=1', // Default compression strategy
  //   '-blur 0x0.1', // Really simple blur
  //   '-strip', // Remove all metadata
  //   '-define png:exclude-chunk=all', // Remove PNG metadata
  //   '-interlace none', // Load sequentially (not progressive)
  // ];
  // await firost.run(
  //   `convert ${convertOptions.join(' ')} ${picturePath} ${compressedPath}`
  // );
  //
  // const picturePath = this.getPicturePath(bookSlug, dungeonSlug);
  // const { width, height } = imageSize(picturePath);
  // return { width, height };
  async dimensions(target) {
    const filepath = await this.normalizePath(target);
    const image = sharp(filepath);
    const { width, height } = await image.metadata();
    return { width, height };
  },
  async normalizePath(target) {
    return path.resolve(target);
  },
};
