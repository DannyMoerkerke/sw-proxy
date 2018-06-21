[![view on npm](https://img.shields.io/npm/v/stream-read-all.svg)](https://www.npmjs.org/package/stream-read-all)
[![npm module downloads](https://img.shields.io/npm/dt/stream-read-all.svg)](https://www.npmjs.org/package/stream-read-all)
[![Build Status](https://travis-ci.org/75lb/stream-read-all.svg?branch=master)](https://travis-ci.org/75lb/stream-read-all)
[![Coverage Status](https://coveralls.io/repos/github/75lb/stream-read-all/badge.svg?branch=master)](https://coveralls.io/github/75lb/stream-read-all?branch=master)
[![Dependency Status](https://david-dm.org/75lb/stream-read-all.svg)](https://david-dm.org/75lb/stream-read-all)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# stream-read-all

Returns a promise which resolves once all data has been read.

```js
const stream = fs.createReadStream('./package.json')
const data = await streamReadAll(stream)
```

* * *

&copy; 2017 Lloyd Brookes <75pound@gmail.com>.