module.exports = MiddlewareBase => class RequestMonitor extends MiddlewareBase {
  description () {
    return 'Feeds traffic information to the `--verbose` output.'
  }
  middleware () {
    return async (ctx, next) => {
      const util = require('util')

      /* first, inspect the request */
      const reqInfo = {
        socketId: ctx.req.socket.id,
        requestId: ctx.req.requestId,
        method: ctx.req.method,
        url: ctx.req.url,
        headers: ctx.req.headers
      }
      if (ctx.request.rawBody) {
        if (Object.keys(ctx.request.body).length) {
          reqInfo.body = ctx.request.body
        } else {
          reqInfo.body = ctx.request.rawBody
        }
      } else {
        const incomingBuffer = ctx.req._readableState.buffer
        if (incomingBuffer.head && incomingBuffer.head.data.length) {
          reqInfo.bodyHead = incomingBuffer.head.data.toString('utf8', 0, 1000)
        }
      }
      this.emit('verbose', 'server.request', reqInfo)

      /* next, inspect the response */
      await next()
      const resInfo = {
        socketId: ctx.req.socket.id,
        requestId: ctx.req.requestId,
        statusCode: ctx.res.statusCode
      }
      const headers = (ctx.res.getHeaders && ctx.res.getHeaders()) || ctx.res._headers
      if (headers) resInfo.headers = headers
      if (ctx.body) resInfo.body = ctx.body

      if (ctx.response.is('json')) {
        try {
          resInfo.body = JSON.parse(resInfo.body)
        } catch (err) {}
      }

      const stream = require('stream')
      if (resInfo.body instanceof stream.Readable) {
        if (/text\/event-stream/.test(ctx.response.type)) {
          resInfo.body[util.inspect.custom] = function (depth, options) {
            return options.stylize('[ SSE event-stream ]', 'special')
          }
        } else if (ctx.body.path) {
          resInfo.body[util.inspect.custom] = function (depth, options) {
            return options.stylize(`[ ReadStream: ${ctx.body.path} ]`, 'special')
          }
        } else {
          resInfo.body[util.inspect.custom] = function (depth, options) {
            return options.stylize(`[ Readable Stream ]`, 'special')
          }
        }
      }
      this.emit('verbose', 'server.response', resInfo)
    }
  }
}
