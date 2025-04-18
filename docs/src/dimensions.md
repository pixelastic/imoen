---
title: dimensions
---

<div class="lead">
  Returns the image dimensions as an object with a <code>width</code> and
  <code>height</code> properties
</div>

`await dimensions(target)`

## Examples

```js
import { dimensions } from 'imoen';

const { width, height } = await dimensions('./picture.png');
console.info(`This file is ${width}x${height}px`);

const { width, height } = await dimensions('https://preview.redd.it/7q6bt9fq4es41.jpg?auto=webp&s=acdad5f740ecf45a262eca2b5d41fe96760bd90f');
console.info(`This file is ${width}x${height}px`);
```
