const imoen = require('../../../lib/');
const glob = require('firost/glob');
const pMap = require('golgoth/pMap');
const path = require('path');
const _ = require('golgoth/lodash');

module.exports = async () => {
  const filepaths = await glob('src/examples/*');

  const examples = [];
  await pMap(filepaths, async (filepath) => {
    const basename = path.basename(filepath);
    const slug = path.basename(filepath, path.extname(filepath));
    const { width, height } = await imoen.dimensions(filepath);
    const lqip = await imoen.lqip(filepath);
    examples.push({ basename, slug, lqip, width, height });
  });
  return _.sortBy(examples, 'slug');
};
