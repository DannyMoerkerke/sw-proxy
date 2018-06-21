const TestRunner = require('test-runner')
const Spa = require('../')
const Lws = require('lws')
const request = require('req-then')
const a = require('assert')
const Static = require('lws-static')
const url = require('url')
const usage = require('lws/lib/usage')
usage.disable()

const runner = new TestRunner()

runner.test('simple', async function () {
  const port = 8000 + this.index
  const lws = new Lws()
  const server = lws.listen({
    port,
    stack: [ Spa, Static ],
    directory: 'test',
    spa: 'one.txt'
  })

  /* missing file redirects to spa */
  const reqOptions = url.parse(`http://localhost:${port}/asdf`)
  reqOptions.headers = {
    accept: 'text/html'
  }
  const response = await request(reqOptions)
  a.strictEqual(response.res.statusCode, 200)
  a.ok(/one/.test(response.data.toString()))

  /* html requests for missing files with extensions do not redirect to spa */
  const reqOptions2 = url.parse(`http://localhost:${port}/asdf.txt`)
  reqOptions2.headers = {
    accept: 'text/html'
  }
  const response2 = await request(reqOptions2)
  a.strictEqual(response2.res.statusCode, 404)

  /* existing static file */
  const reqOptions3 = url.parse(`http://localhost:${port}/two.txt`)
  const response3 = await request(reqOptions3)
  a.strictEqual(response3.res.statusCode, 200)
  a.ok(/two/.test(response3.data.toString()))

  /* not a text/html request - does not redirect to spa */
  const reqOptions4 = url.parse(`http://localhost:${port}/asdf`)
  reqOptions4.headers = {
    accept: 'application/json'
  }
  const response4 = await request(reqOptions4)
  a.strictEqual(response4.res.statusCode, 404)

  server.close()
})
