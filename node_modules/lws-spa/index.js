module.exports = MiddlewareBase => class SPA extends MiddlewareBase {
  description () {
    return 'Support for Single Page Applications.'
  }
  optionDefinitions () {
    return [
      {
        name: 'spa',
        type: String,
        alias: 's',
        typeLabel: '{underline file}',
        description: 'Path to a Single Page App, e.g. app.html.'
      },
      {
        name: 'spa.asset-test',
        type: String,
        typeLabel: '{underline RegExp}',
        description: 'A regular expression to identify an asset file. Defaults to "\\.".'
      }
    ]
  }
  middleware (options) {
    const spa = options.spa
    if (spa) {
      const path = require('path')
      const send = require('koa-send')
      const _ = require('koa-route')
      const root = path.resolve(options.directory || process.cwd())
      const assetTest = new RegExp(options.spaAssetTest || '\\.')
      this.emit('verbose', 'middleware.spa.config', { spa, root, assetTest })
      return _.get('*', (ctx, route, next) => {
        if (ctx.accepts('text/html') && !assetTest.test(route)) {
          return send(ctx, spa, { root })
        } else {
          return next()
        }
      })
    }
  }
}
