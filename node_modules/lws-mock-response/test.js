const TestRunner = require('test-runner')
const MockResponse = require('./')
const Lws = require('lws')
const request = require('req-then')
const runner = new TestRunner()
const a = require('assert')
const usage = require('lws/lib/usage')
usage.disable()

runner.test('simple', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const Mock = MockBase => class extends MockBase {
    mocks () {
      return [
        {
          route: '/one',
          responses: [
            { response: { body: 'one' } }
          ]
        }
      ]
    }
  }
  const server = lws.listen({
    port,
    stack: MockResponse,
    mocks: Mock
  })
  const response = await request(`http://localhost:${port}/one`)
  server.close()
  a.strictEqual(response.res.statusCode, 200)
  a.strictEqual(response.data.toString(), 'one')
})
