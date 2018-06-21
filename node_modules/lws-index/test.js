const TestRunner = require('test-runner')
const Index = require('./')
const Lws = require('lws')
const request = require('req-then')
const a = require('assert')

const runner = new TestRunner()

runner.test('no options', async function () {
  const port = 9000 + this.index
  const lws = new Lws()
  const server = lws.listen({
    stack: Index,
    port: port
  })
  const response = await request(`http://localhost:${port}/`)
  server.close()
  a.ok(/listing directory/.test(response.data.toString()))
  a.ok(/class="icon/.test(response.data.toString()))
})
