import path from 'node:path';
import { absolute, mkdirp } from 'firost';
import fs from 'fs-extra';

/**
 * Write a sharp pipeline to disk, in the format of the destination extension
 * @param {object} pipeline Sharp pipeline of the image to write
 * @param {string} destination Path to the output file
 * @param {object} options Options passed as-is to the sharp format method
 **/
export async function writeImage(pipeline, destination, options = {}) {
  const filepath = absolute(destination);
  const extname = path.extname(filepath).replace('.', '').toLowerCase();
  const format = extname === 'jpg' ? 'jpeg' : extname;

  const buffer = await pipeline.toFormat(format, options).toBuffer();

  // firost write() ignores buffers, so we write them with fs directly
  await mkdirp(path.dirname(filepath));
  await fs.writeFile(filepath, buffer);
}
