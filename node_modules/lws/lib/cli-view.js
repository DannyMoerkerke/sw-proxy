'use strict'

module.exports = ViewBase => class CliView extends ViewBase {
  optionDefinitions () {
    return [
      {
        name: 'verbose',
        type: Boolean,
        alias: 'v',
        description: 'Outputs a highly verbose JSON stream containing debug information. Intended as a datasource for custom views.',
        section: 'core'
      },
      {
        name: 'verbose.include',
        multiple: true,
        description: 'One or more regular expressions describing which event keys to include in verbose output. Implies --verbose.'
      },
      {
        name: 'verbose.exclude',
        multiple: true,
        description: 'One or more regular expressions describing which event keys to exclude from verbose output. Implies --verbose.'
      }
    ]
  }
  write (key, value, options) {
    if (key === 'koa.error') {
      const { printError } = require('./util')
      printError(value, 'Middleware error')
    } else if (key === 'server.listening') {
      this.printListeningMsg(value)
    } else {
      if (options.verbose || options.verboseInclude || options.verboseExclude) {
        const verboseInclude = options.verboseInclude
        const verboseExclude = options.verboseExclude
        let printThis = true
        if (verboseInclude && verboseInclude.length) {
          printThis = verboseInclude.some(pickExpression => RegExp(pickExpression).test(key))
        }
        if (verboseExclude && verboseExclude.length) {
          printThis = !verboseExclude.some(pickExpression => RegExp(pickExpression).test(key))
        }
        if (printThis) {
          const util = require('util')
          const output = {}
          output[key] = value
          console.log(util.inspect(output, {
            depth: 6,
            colors: true,
            maxArrayLength: null
          }))
        }
      }
    }
  }
}
