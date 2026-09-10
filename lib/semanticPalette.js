import { _ } from 'golgoth';
import { Vibrant } from 'node-vibrant/node';
import sharp from 'sharp';
import { bucketize } from './bucketize.js';
import { contrastRatio } from './contrastRatio.js';
import { normalizeTarget } from './normalizeTarget.js';

export let __;

/**
 * Extract 4 semantic color roles from an image
 * @param {string} target - URL or filepath to the image
 * @returns {object|boolean} Object with background, text, accent, muted keys, or false on error
 */
export async function semanticPalette(target) {
  const filepath = await normalizeTarget(target);
  if (!filepath) {
    return false;
  }

  const clusters = await __.getClusters(filepath);
  const background = __.extractBackground(clusters);
  const text = __.extractText(clusters, background);
  const { accent, muted } = await __.extractVibrantColors(filepath);

  return { background, text, accent, muted };
}

__ = {
  /**
   * Get the dominant background color from pixel clustering
   * @param {Array<{color: string, count: number}>} clusters - Clusters sorted by count descending
   * @returns {string} Hex color of the largest cluster
   */
  extractBackground(clusters) {
    return clusters[0].color;
  },

  /**
   * Find the first cluster with WCAG contrast ≥ 4.5 against background
   * @param {Array<{color: string, count: number}>} clusters - Clusters sorted by count descending
   * @param {string} background - Background hex color
   * @returns {string|null} Hex color or null if none qualifies
   */
  extractText(clusters, background) {
    const match = _.find(clusters.slice(1), (cluster) => {
      return contrastRatio(cluster.color, background) >= 4.5;
    });

    return match ? match.color : null;
  },

  /**
   * Extract accent and muted colors via node-vibrant
   * @param {string} filepath - Absolute path to the image
   * @returns {object} { accent, muted } hex strings or null
   */
  async extractVibrantColors(filepath) {
    const palette = await Vibrant.from(filepath).getPalette();

    const accent =
      palette.Vibrant?.hex ||
      palette.LightVibrant?.hex ||
      palette.DarkVibrant?.hex ||
      null;

    const muted =
      palette.Muted?.hex ||
      palette.LightMuted?.hex ||
      palette.DarkMuted?.hex ||
      null;

    return { accent, muted };
  },

  /**
   * Get pixel clusters from an image via sharp + bucketize
   * @param {string} filepath - Absolute path to the image
   * @returns {Array<{color: string, count: number}>} Clusters sorted by count descending
   */
  async getClusters(filepath) {
    const { data } = await sharp(filepath)
      .raw()
      .toBuffer({ resolveWithObject: true });
    return bucketize(data);
  },
};
