module.exports = MiddlewareBase => class Cors extends MiddlewareBase {
  description () {
    return 'Support for HTTP Range Requests.'
  }
  
  middleware () {
    return require('koa-range')
  }
}
