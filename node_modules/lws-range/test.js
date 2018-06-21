const TestRunner = require('test-runner')
const Range = require('./')
const Lws = require('lws')
const request = require('req-then')
const usage = require('lws/lib/usage')
const a = require('assert')
usage.disable()

const runner = new TestRunner()

runner.test('simple', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const server = lws.listen({ port, stack: Range })
  const response = await request(`http://localhost:${port}/`)
  a.strictEqual(response.res.headers['accept-ranges'], 'bytes')
  server.close()
})
