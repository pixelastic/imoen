---
title: imoen
---

# imoen

Simple image processing for nodejs.

```
const imoen = require('imoen');

// Get a base64 encoded string usable as an lqip
const lqip = await imoen.lqip('./path/to/file.png')
// Returns a { width, height } object
const dimensions = await imoen.dimensions('./path/to/file.png')

// All method also work with urls