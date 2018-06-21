const TestRunner = require('test-runner')
const Static = require('../')
const Lws = require('lws')
const request = require('req-then')
const a = require('assert')

const runner = new TestRunner()

runner.test('simple', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const server = lws.listen({
    port,
    stack: [ Static ],
    directory: 'test/fixture'
  })
  const response = await request(`http://localhost:${port}/one.html`)
  a.strictEqual(response.data.toString(), 'one\n')
  server.close()
})
