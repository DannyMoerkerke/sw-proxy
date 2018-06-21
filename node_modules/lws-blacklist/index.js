module.exports = MiddlewareBase => class Blacklist extends MiddlewareBase {
  description () {
    return 'Forbid access to sensitive or private resources.'
  }

  optionDefinitions () {
    return {
      name: 'blacklist',
      type: String,
      multiple: true,
      typeLabel: '{underline path} {underline ...}',
      description: 'A list of routes to forbid, e.g. `--blacklist "/admin/*" "*.php"`'
    }
  }

  middleware (options) {
    const arrayify = require('array-back')
    const blacklist = arrayify(options.blacklist)
    if (blacklist.length) {
      const pathToRegexp = require('path-to-regexp')
      this.emit('verbose', 'middleware.blacklist.config', { blacklist })
      return function (ctx, next) {
        if (blacklist.some(expression => pathToRegexp(expression).test(ctx.path))) {
          ctx.status = 403
        } else {
          return next()
        }
      }
    }
  }
}
