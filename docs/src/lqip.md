---
title: lqip
---

<div class="lead">
  Returns a base64 encoded Low Quality Image Placeholder (lqip) of any given
  image.
</div>

`await lqip(target)`

## Examples

```js
const localPlaceholder = await imoen.lqip('./picture.png');
console.info(localPlaceholder); // iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4k...

const remotePlaceholder = await imoen.lqip(
  'https://preview.redd.it/7q6bt9fq4es41.jpg?auto=webp&s=acdad5f740ecf45a262eca2b5d41fe96760bd90f'
);
console.info(remotePlaceholder); // iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4k...
```

## Notes

The returned values does not include the base64 prefix, so if you'd like to
display it in an webpage, you should add `data:image/png;base64,` before it.

The best results are achieved when the placeholder is displayed with dimensions
equal to the original picture dimensions, and with a blur effect applied
(something like `filter: blur(5px);` in CSS works well).
