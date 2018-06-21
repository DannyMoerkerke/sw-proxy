'use strict'
const flatten = require('reduce-flatten')
const EventEmitter = require('events')
const MiddlewareBase = require('./middleware-base')

/**
 * Array of Middleware instances
 * @module stack
 */

class EmittingArray extends Array {}
Object.assign(EmittingArray.prototype, EventEmitter.prototype)

class Stack extends EmittingArray {
  /**
   * Returns and array of middleware functions
   * @returns {middleware[]}
   */
  getMiddlewareFunctions (options) {
    return this
      .filter(mw => mw.middleware)
      .map(mw => mw.middleware(Object.assign({}, options)))
      .reduce(flatten, [])
      .filter(mw => mw)
  }

  /**
   * @return {OptionDefinition[]}
   */
  getOptionDefinitions () {
    return this
      .filter(mw => mw.optionDefinitions)
      .map(mw => mw.optionDefinitions())
      .reduce(flatten, [])
      .filter(def => def)
  }

  static create (mwModules = [], options) {
    loadMiddlewareModules(mwModules, options)
    const stack = this.from(mwModules.map(mwModule => {
      const Middleware = mwModule(MiddlewareBase)
      return new Middleware()
    }))
    stack.forEach(mw => {
      mw.on('verbose', (key, value) => stack.emit('verbose', key, value))
    })
    return stack
  }
}

/**
 * loads any paths within a feature stack
 * @param [options] {object}
 * @param [options.module-dir] {string[]}
 * @param [options.module-prefix] {string}
 * @return {Middleware[]}
 */
function loadMiddlewareModules (MwModules, options) {
  MwModules.forEach((MwModule, index) => {
    if (typeof MwModule === 'string') {
      MwModules[index] = MiddlewareBase.load(MwModule, options)
    }
  })
}

module.exports = Stack
