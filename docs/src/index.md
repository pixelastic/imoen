---
title: Low quality image placeholders
---

> Heya! It's me, Imoen!

Image processing for nodejs.

```js
const imoen = require('imoen');

// Get a base64 encoded string usable as an lqip
const lqip = await imoen.lqip('./path/to/file.png')
// Returns a { width, height } object
const dimensions = await imoen.dimensions('./path/to/file.png')

// All method also work with urls
```

<!--
 ## Examples

 ```js
 const picturePath = "./imp.png";
 const { width, height } = await imoen.dimensions(picturePath);
 const placeholder = await imoen.lqip(picturePath);
 ```

 ```html
 <img src="data:image/png;base64,{placeholder}" width="{width}" height="{height}"
 style="filter:blur(5px)" />
 ```
-->



