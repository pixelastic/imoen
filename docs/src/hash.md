---
title: hash
---

<div class="lead">
  Returns a unique md5 hash identifying the image that can be used for cache
  busting.
</div>

`await hash(target)`

## Examples

```js
import { hash } from 'imoen';

const revv = await hash('./picture.png');
const url = `http://www.pixelastic.com/picture.png?revv=${revv}`
```
