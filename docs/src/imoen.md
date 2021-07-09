---
title: imoen
---

<div class="lead">
  Returns an object with all metadata required to display a blurry placeholder of
  any image.
</div>

`await imoen(target)`

## Examples

```js
// Get all metadata. Works for local files as well as remote URLs
const { width, height, lqip } = await imoen(target);
```

And use it like this:

```html
<img src="${lqip}" height="${height}" width="${width}" style="filter:blur(5px)" />
```

## Other metadata

`imoen()` also returns the following information:

- `filesize`: File size in bytes
