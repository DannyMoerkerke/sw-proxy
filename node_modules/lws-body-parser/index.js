module.exports = MiddlewareBase => class BodyParser extends MiddlewareBase {
  description () {
    return 'Parses the request body, making `ctx.request.body` available to downstream middleware.'
  }
  middleware () {
    return require('koa-bodyparser')()
  }
}
