---
title: convert
---

<div class="lead">
  Converts an image to another format and writes it to a destination file.
</div>

`await convert(source, destination, options)`

The format of the output is set by the extension of `destination`. Returns the
absolute path to the output file, or `false` if the source does not exist.

`options` are passed as-is to the matching [sharp output
method](https://sharp.pixelplumbing.com/api-output), like `quality` for JPEG
and WebP.

## Examples

```js
import { convert } from 'imoen';

await convert('./picture.png', './picture.webp');
await convert('./picture.png', './picture.jpg', { quality: 60 });
await convert('https://example.com/picture.jpg', './picture.png');
```
