module.exports = MiddlewareBase => class Index extends MiddlewareBase {
  description () {
    return 'Serves directory listings.'
  }
  optionDefinitions () {
    return [
      {
        name: 'index.root',
        type: String,
        typeLabel: '{underline path}',
        description: 'Index root directory, defaults to --directory or the current directory.'
      },
      {
        name: 'index.hidden',
        type: Boolean,
        description: 'Show hidden files.'
      },
      {
        name: 'index.view',
        type: String,
        typeLabel: '{underline name}',
        description: 'Display mode, either `tiles` or `details`. Defaults to tiles.'
      }
    ]
  }
  middleware (options) {
    const path = options.indexRoot || options.directory || process.cwd()
    if (path) {
      const serveIndex = require('serve-index-75lb')
      const indexOptions = { icons: true }
      if (options.indexHidden !== undefined) indexOptions.indexHidden = options.indexHidden
      if (options.indexView !== undefined) indexOptions.indexView = options.indexView
      this.emit('verbose', 'middleware.index.config', indexOptions)
      const index = serveIndex(path, indexOptions)
      return (ctx, next) => {
        return new Promise((resolve, reject) => {
          function expressNext () {
            next()
            resolve()
          }
          index(ctx.req, ctx.res, expressNext, ctx)
        })
      }
    }
  }
}
