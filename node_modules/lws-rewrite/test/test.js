const TestRunner = require('test-runner')
const Rewrite = require('../')
const Static = require('lws-static')
const Lws = require('lws')
const request = require('req-then')
const a = require('assert')

const runner = new TestRunner()

runner.test('simple', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const server = lws.listen({
    port,
    stack: [ Rewrite, Static ],
    directory: 'test/fixture',
    rewrite: { from: '/two.html', to: '/one.html' }
  })
  const response = await request(`http://localhost:${port}/two.html`)
  a.strictEqual(response.data.toString(), 'one\n')
  server.close()
})
