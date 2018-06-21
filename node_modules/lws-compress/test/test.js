const TestRunner = require('test-runner')
const Compress = require('../')
const Lws = require('lws')
const request = require('req-then')
const url = require('url')
const runner = new TestRunner()
const a = require('assert')

runner.test('simple', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const One = MiddlewareBase => class extends MiddlewareBase {
    middleware (options) {
      return async function (ctx, next) {
        await next()
        const fs = require('fs')
        ctx.body = fs.readFileSync('test/big-file.txt', 'utf8')
      }
    }
  }
  const server = lws.create({
    port,
    stack: [ One, Compress ],
    compress: true
  })
  const reqOptions = url.parse(`http://localhost:${port}/`)
  reqOptions.headers = {
    'Accept-Encoding': 'gzip'
  }
  const response = await request(reqOptions)
  server.close()
  a.strictEqual(response.res.headers.vary, 'Accept-Encoding')
})
