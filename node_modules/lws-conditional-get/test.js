const TestRunner = require('test-runner')
const ConditionalGet = require('./')
const Lws = require('lws')
const request = require('req-then')
const runner = new TestRunner()
const a = require('assert')
const url = require('url')
const usage = require('lws/lib/usage')
usage.disable()

runner.test('simple', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const One = Base => class extends Base {
    middleware () {
      return async function (ctx, next) {
        await next()
        ctx.body = 'one'
      }
    }
  }
  const server = lws.listen({
    port,
    stack: [ ConditionalGet, One ]
  })
  const response = await request(`http://localhost:${port}/`)
  const etag = response.res.headers.etag
  const reqOptions2 = url.parse(`http://localhost:${port}/`)
  reqOptions2.headers = {
    'If-None-Match': etag
  }
  const response2 = await request(reqOptions2)
  server.close()
  a.strictEqual(response.res.statusCode, 200)
  a.strictEqual(response2.res.statusCode, 304)
})

runner.test('disabled', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const One = Base => class extends Base {
    middleware () {
      return async function (ctx, next) {
        await next()
        ctx.body = 'one'
      }
    }
  }
  const server = lws.listen({
    port,
    stack: [ ConditionalGet, One ],
    noConditionalGet: true
  })
  const response = await request(`http://localhost:${port}/`)
  server.close()
  a.strictEqual(response.res.statusCode, 200)
  a.strictEqual(response.res.headers.etag, undefined)
})
