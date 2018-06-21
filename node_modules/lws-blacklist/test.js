const TestRunner = require('test-runner')
const Blacklist = require('./')
const Lws = require('lws')
const request = require('req-then')
const runner = new TestRunner()
const a = require('assert')

runner.test('simple', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const server = lws.listen({
    port,
    stack: Blacklist,
    blacklist: '/one'
  })
  const response = await request(`http://localhost:${port}/one`)
  const response2 = await request(`http://localhost:${port}/two`)
  server.close()
  a.strictEqual(response.res.statusCode, 403)
  a.strictEqual(response2.res.statusCode, 404)
})
