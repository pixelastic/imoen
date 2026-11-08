import os from 'node:os';
import { absolute, wrap } from 'firost';

export let __;

__ = {
  cache: {},

  /**
   * Get the shared settings of the module
   * @returns {object} Settings, with cacheDirectory (where to save the
   * downloaded files) and cache (in-memory cache of resolved filepaths)
   **/
  getConfig() {
    return {
      cacheDirectory: absolute(os.tmpdir(), 'imoen'),
      cache: __.cache,
    };
  },
};

export const getConfig = wrap(__, 'getConfig');
