[![view on npm](https://img.shields.io/npm/v/load-module.svg)](https://www.npmjs.org/package/load-module)
[![npm module downloads](https://img.shields.io/npm/dt/load-module.svg)](https://www.npmjs.org/package/load-module)
[![Build Status](https://travis-ci.org/75lb/load-module.svg?branch=master)](https://travis-ci.org/75lb/load-module)
[![Dependency Status](https://david-dm.org/75lb/load-module.svg)](https://david-dm.org/75lb/load-module)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

<a name="module_load-module"></a>

## load-module
Like node's `require` but with a few extra features:
- You can specify your folders in which to search for modules
- You can specify a module prefix

**Example**  
```js
const loadModule = require('load-module')
```
<a name="exp_module_load-module--loadModule"></a>

### loadModule(modulePath, [options]) ⏏
**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| modulePath | <code>string</code> | module identifier |
| [options] | <code>object</code> |  |
| [options.modulePrefix] | <code>string</code> | If the input `moduleID` is `rewrite` and the `module-prefix` is `lws`, load-module will attempt to laod `lws-rewrite` then `rewrite`. |
| [options.moduleDir] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | An additional location to search for modules. |


* * *

&copy; 2017-18 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
