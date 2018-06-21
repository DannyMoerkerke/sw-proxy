const TestRunner = require('test-runner')
const RequestMonitor = require('./')
const Lws = require('lws')
const request = require('req-then')
const Counter = require('test-runner-counter')
const a = require('assert')

const runner = new TestRunner()

runner.test('simple', async function () {
  const counter = Counter.create(2)
  const port = 8000 + this.index
  const lws = new Lws()
  lws.on('verbose', (key, value) => {
    if (key === 'server.request') counter.pass()
    if (key === 'server.response') counter.pass()
  })
  const server = lws.listen({ port, stack: RequestMonitor })
  const response = await request(`http://localhost:${port}/`)
  server.close()
  return counter.promise
})
