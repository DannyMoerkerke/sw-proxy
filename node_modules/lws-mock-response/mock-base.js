const EventEmitter = require('events')
const util = require('util')

class MockBase extends EventEmitter {
  /* use the class name to represent the mock in --verbose output */
  [util.inspect.custom] (depth, options) {
    return options.stylize(this.constructor.name, 'special')
  }
}

module.exports = MockBase
