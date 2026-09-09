export let __;

/**
 * Compute WCAG 2.1 contrast ratio between two hex colors
 * @param {string} hexA - 6-digit hex color (e.g. "#ff0000")
 * @param {string} hexB - 6-digit hex color (e.g. "#000000")
 * @returns {number} Contrast ratio between 1 and 21
 */
export function contrastRatio(hexA, hexB) {
  const luminanceA = __.relativeLuminance(hexA);
  const luminanceB = __.relativeLuminance(hexB);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

__ = {
  /**
   * Linearize an sRGB channel value per the WCAG 2.1 spec
   * @param {number} channelValue - sRGB value 0–255
   * @returns {number} Linear RGB value 0–1
   */
  linearize(channelValue) {
    const srgb = channelValue / 255;
    if (srgb <= 0.04045) {
      return srgb / 12.92;
    }
    return ((srgb + 0.055) / 1.055) ** 2.4;
  },

  /**
   * Compute relative luminance of a hex color per WCAG 2.1
   * @param {string} hex - 6-digit hex color (e.g. "#ff0000")
   * @returns {number} Relative luminance 0–1
   */
  relativeLuminance(hex) {
    const raw = hex.replace('#', '');
    const r = __.linearize(parseInt(raw.substring(0, 2), 16));
    const g = __.linearize(parseInt(raw.substring(2, 4), 16));
    const b = __.linearize(parseInt(raw.substring(4, 6), 16));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
};
