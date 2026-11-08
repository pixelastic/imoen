---
title: resize
---

<div class="lead">
  Resizes an image to the given dimensions and writes it to a destination file.
</div>

`await resize(source, destination, options)`

The format of the output is set by the extension of `destination`. Returns the
absolute path to the output file, or `false` if the source does not exist.

## Options

- `width`: Width of the output, in pixels (`400`) or as a percentage of the
  source width (`'50%'`)
- `height`: Height of the output, in pixels (`300`) or as a percentage of the
  source height (`'50%'`)
- `force`: Allow the output to be larger than the source (default: `false`)
- `convert`: Format options, passed as-is to [convert](convert)

At least one of `width` or `height` is required. When only one is set, the
ratio is kept. When both are set, the image is stretched to the exact
dimensions.

## Examples

```js
import { resize } from 'imoen';

// Keep the ratio
await resize('./picture.png', './small.png', { width: 400 });

// Half the size of the source
await resize('./picture.png', './half.webp', { width: '50%' });

// Stretch to exact dimensions
await resize('./picture.png', './square.jpg', { width: 100, height: 100 });

// Enlarge the picture, and set the JPEG quality
await resize('./picture.jpg', './big.jpg', {
  width: '200%',
  force: true,
  convert: { quality: 90 },
});
```

## Notes

- Without `force`, an image is never enlarged. Smaller targets are capped to the
  source size.
- Percentages apply to the upright image, after its EXIF orientation is
  applied.
- Invalid values (such as `'abc'`, `'50'`, `0` or `'-10%'`) throw an error.
