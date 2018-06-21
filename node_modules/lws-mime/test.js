const TestRunner = require('test-runner')
const Mime = require('./')
const Lws = require('lws')
const request = require('req-then')
const a = require('assert')

const runner = new TestRunner()

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
    stack: [ Mime, One ],
    mime: {
      'text/yeah': [ 'txt' ]
    }
  })
  const response = await request(`http://localhost:${port}/one.txt`)
  server.close()
  a.ok(/yeah/.test(response.res.headers['content-type']))
})
