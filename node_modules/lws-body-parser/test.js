const TestRunner = require('test-runner')
const BodyParser = require('./')
const Lws = require('lws')
const request = require('req-then')
const url = require('url')
const runner = new TestRunner()
const a = require('assert')
const Counter = require('test-runner-counter')

runner.test('simple', async function () {
  const counter = Counter.create(1)
  const port = 8000 + this.index
  const lws = new Lws()
  const One = MiddlewareBase => class extends MiddlewareBase {
    middleware (options) {
      return function (ctx, next) {
        a.strictEqual(ctx.request.body.one, 'one')
        counter.pass()
      }
    }
  }
  const server = lws.listen({
    port,
    stack: [ BodyParser, One ]
  })
  const reqOptions = url.parse(`http://localhost:${port}/`)
  reqOptions.method = 'POST'
  reqOptions.headers = {
    'content-type': 'application/json'
  }
  const response = await request(reqOptions, JSON.stringify({ one: 'one' }))
  server.close()
  return counter.promise
})
