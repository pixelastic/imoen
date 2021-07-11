---
title: hash
---

<div class="lead">
  Returns a unique md5 hash identifying the image that can be used for cache
  busting.
</div>

`await imoen.hash(target)`

## Examples

```js
const hash = await imoen.hash('./picture.png');
const url = `http://www.pixelastic.com/picture.png?hash=${hash}`
```
