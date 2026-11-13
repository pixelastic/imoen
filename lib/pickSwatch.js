import { _ } from 'golgoth';

export let __;

const WEIGHTS = { saturation: 3, luma: 6.5, population: 0.5 };

const ROLES = {
  Vibrant: {
    targetLuma: 0.5,
    minLuma: 0.3,
    maxLuma: 0.7,
    targetSaturation: 1,
    minSaturation: 0.35,
    maxSaturation: 1,
  },
  LightVibrant: {
    targetLuma: 0.74,
    minLuma: 0.55,
    maxLuma: 1,
    targetSaturation: 1,
    minSaturation: 0.35,
    maxSaturation: 1,
  },
  DarkVibrant: {
    targetLuma: 0.26,
    minLuma: 0,
    maxLuma: 0.45,
    targetSaturation: 1,
    minSaturation: 0.35,
    maxSaturation: 1,
  },
  Muted: {
    targetLuma: 0.5,
    minLuma: 0.3,
    maxLuma: 0.7,
    targetSaturation: 0.3,
    minSaturation: 0,
    maxSaturation: 0.4,
  },
  LightMuted: {
    targetLuma: 0.74,
    minLuma: 0.55,
    maxLuma: 1,
    targetSaturation: 0.3,
    minSaturation: 0,
    maxSaturation: 0.4,
  },
  DarkMuted: {
    targetLuma: 0.26,
    minLuma: 0,
    maxLuma: 0.45,
    targetSaturation: 0.3,
    minSaturation: 0,
    maxSaturation: 0.4,
  },
};

/**
 * Pick the cluster that best matches a swatch role (Vibrant, Muted, etc),
 * using the same target/weight scoring as node-vibrant
 * @param {Array<{color: string, count: number}>} clusters - Color clusters
 * @param {string} role - Swatch role name
 * @returns {string|null} Hex color of the best cluster, or null if none fits
 */
export function pickSwatch(clusters, role) {
  const target = ROLES[role];
  const maxCount = _.chain(clusters).map('count').max().value();

  let best = null;
  let bestScore = 0;
  _.each(clusters, (cluster) => {
    const { saturation, luma } = __.toHsl(cluster.color);
    const isInRange =
      saturation >= target.minSaturation &&
      saturation <= target.maxSaturation &&
      luma >= target.minLuma &&
      luma <= target.maxLuma;
    if (!isInRange) {
      return;
    }
    const score = __.score({
      saturation,
      luma,
      population: cluster.count / maxCount,
      target,
    });
    if (best === null || score > bestScore) {
      best = cluster.color;
      bestScore = score;
    }
  });

  return best;
}

__ = {
  /**
   * Weighted mean of how close a cluster is to the role targets
   * @param {object} input - Saturation, luma and population of the cluster
   * @param {number} input.saturation - HSL saturation, 0 to 1
   * @param {number} input.luma - HSL lightness, 0 to 1
   * @param {number} input.population - Cluster size relative to the largest
   * @param {object} input.target - Role definition
   * @returns {number} Score, higher is better
   */
  score({ saturation, luma, population, target }) {
    const values = [
      [1 - Math.abs(saturation - target.targetSaturation), WEIGHTS.saturation],
      [1 - Math.abs(luma - target.targetLuma), WEIGHTS.luma],
      [population, WEIGHTS.population],
    ];
    // Like node-vibrant, a zero value is left out of the mean
    const kept = _.filter(values, ([value]) => value);
    const sum = _.sumBy(kept, ([value, weight]) => value * weight);
    const weightSum = _.sumBy(kept, ([, weight]) => weight);
    return sum / weightSum;
  },

  /**
   * Convert a hex color to HSL saturation and lightness
   * @param {string} hex - 6-digit hex color (e.g. "#ff0000")
   * @returns {object} { saturation, luma }, both between 0 and 1
   */
  toHsl(hex) {
    const raw = hex.replace('#', '');
    const [r, g, b] = _.map([0, 2, 4], (start) => {
      return parseInt(raw.substring(start, start + 2), 16) / 255;
    });
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const luma = (max + min) / 2;
    if (max === min) {
      return { saturation: 0, luma };
    }
    const delta = max - min;
    const saturation =
      luma > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    return { saturation, luma };
  },
};
