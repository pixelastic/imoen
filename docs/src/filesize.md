---
title: filesize
---

<div class="lead">
  Returns the image filesize in bytes
</div>

`await imoen.filesize(target)`

## Examples

```js
const filesize = await imoen.filesize('./picture.png');
if (filesize > 10485760) {
  console.info("This file cannot be processed by Cloudinary")
}
```
