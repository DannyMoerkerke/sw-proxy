module.exports = MiddlewareBase => class Cors extends MiddlewareBase {
  description () {
    return 'Support for setting Cross-Origin Resource Sharing (CORS) headers.'
  }
  optionDefinitions () {
    return [
      {
        name: 'cors.origin',
        description: '`Access-Control-Allow-Origin` value. Default is the request Origin header.'
      },
      {
        name: 'cors.allow-methods',
        description: '`Access-Control-Allow-Methods` value. Default is "GET,HEAD,PUT,POST,DELETE,PATCH"'
      },
      {
        name: 'cors.credentials',
        type: Boolean,
        description: 'Adds `Access-Control-Allow-Credentials` header.'
      }
    ]
  }
  middleware (options) {
    options = options || {}
    const corsOptions = {}
    if (options.corsOrigin) corsOptions.origin = options.corsOrigin
    if (options.corsAllowMethods) corsOptions.allowMethods = options.corsAllowMethods
    if (options.corsCredentials) corsOptions.credentials = options.corsCredentials
    this.emit('verbose', 'middleware.cors.config', corsOptions)
    const kcors = require('@koa/cors')
    return kcors(corsOptions)
  }
}
