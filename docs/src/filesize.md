---
title: filesize
---

<div class="lead">
  Returns the image filesize in bytes
</div>

`await filesize(target)`

## Examples

```js
import { filesize } from 'imoen';

const pictureSize = await filesize('./picture.png');
if (pictureSize > 10485760) {
  console.info("This file cannot be processed by Cloudinary")
}
```
