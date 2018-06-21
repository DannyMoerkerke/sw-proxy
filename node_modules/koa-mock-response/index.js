'use strict'
const arrayify = require('array-back')
const t = require('typical')
const pathToRegexp = require('path-to-regexp')

module.exports = mockResponses

function mockResponses (route, targets) {
  targets = arrayify(targets)
  const pathRe = pathToRegexp(route)

  return function mockResponse (ctx, next) {
    if (pathRe.test(ctx.path)) {

      /* find a mock with compatible method and accepts */
      let target = targets.find(target => {
        return target.request
          && (!target.request.method || (target.request.method && target.request.method === ctx.method))
          && (!target.request.accepts || ctx.request.accepts(target.request.accepts))
          && (!target.request.is || ctx.request.is(target.request.is))
      })

      /* else take the first target without a request (no request means 'all requests') */
      if (!target) {
        target = targets.find(target => !target.request)
      }

      if (target) {
        if (t.isFunction(target.response)) {
          const pathMatches = ctx.path.match(pathRe).slice(1)
          return target.response.apply(null, [ctx].concat(pathMatches))
        } else if (t.isPlainObject(target.response)) {
          Object.assign(ctx.response, target.response)
        } else {
          throw new Error(`Invalid response: ${JSON.stringify(target.response)}`)
        }
      }
    } else {
      return next()
    }
  }
}
