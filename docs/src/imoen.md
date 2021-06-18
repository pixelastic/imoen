---
title: imoen
---

<div class="lead">
  Returns an object will all data required to display a blurry placeholder of
  any image.
</div>

`await imoen(target)`

## Examples

```js
// Get all metadata. Works for local files as well as remote URLs
const { width, height, base64 } = await imoen(target);
```

And use it like this:

```html
<img src="${base64}" height="${height}" width="${width}" style="filter:blur(5px)" />
```
