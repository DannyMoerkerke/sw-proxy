'use strict'
const TestRunner = require('test-runner')
const request = require('req-then')
const Koa = require('koa')
const mockResponse = require('./')
const a = require('assert')
const url = require('url')
const http = require('http')

const runner = new TestRunner()

function listen (server, port) {
  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      resolve()
    })
  })
}

runner.test('mock: simple response', async function () {
  const port = 8100 + this.index
  const app = new Koa()
  app.use(mockResponse('/test', { response: { body: 'test' } }))
  const server = http.createServer(app.callback())
  await listen(server, port)
  const response = await request(`http://localhost:${port}/test`)
  server.close()
  a.strictEqual(response.res.statusCode, 200)
  a.ok(/test/.test(response.data.toString()))
})

runner.test('mock: method request filter', async function () {
  const port = 8100 + this.index
  const app = new Koa()
  app.use(mockResponse('/test', {
    request: { method: 'POST' },
    response: { body: 'test' }
  }))
  const server = http.createServer(app.callback())
  await listen(server, port)
  /* GET should fail */
  const response = await request(`http://localhost:${port}/test`)
  a.strictEqual(response.res.statusCode, 404)
  /* POST should pass */
  const reqOptions = url.parse(`http://localhost:${port}/test`)
  reqOptions.method = 'POST'
  const response2 = await request(reqOptions, JSON.stringify({ data: 'something' }))
  server.close()
  a.strictEqual(response2.res.statusCode, 200)
  a.ok(/test/.test(response2.data.toString()))
})

runner.test('mock: accepts request filter', async function () {
  const port = 8100 + this.index
  const app = new Koa()
  app.use(mockResponse('/test', {
    request: { accepts: 'text' },
    response: { body: 'test' }
  }))
  const server = http.createServer(app.callback())
  await listen(server, port)

  const reqOptions = url.parse(`http://localhost:${port}/test`)
  reqOptions.headers = { Accept: '*/json' }
  const response = await request(reqOptions)

  const reqOptions2 = url.parse(`http://localhost:${port}/test`)
  reqOptions2.headers = { Accept: 'text/plain' }
  const response2 = await request(reqOptions2)
  server.close()

  a.strictEqual(response.res.statusCode, 404)
  a.strictEqual(response2.res.statusCode, 200)
  a.ok(/test/.test(response2.data.toString()))
})

runner.test('mock: responses array', async function () {
  const port = 8100 + this.index
  const app = new Koa()
  app.use(mockResponse('/test', [
    { request: { method: 'GET' }, response: { body: 'get' } },
    { request: { method: 'POST' }, response: { body: 'post' } }
  ]))
  const server = http.createServer(app.callback())
  await listen(server, port)

  const response = await request(`http://localhost:${port}/test`)
  a.strictEqual(response.res.statusCode, 200)
  a.ok(/get/.test(response.data.toString()))

  const reqOptions2 = url.parse(`http://localhost:${port}/test`)
  reqOptions2.method = 'POST'
  const response2 = await request(reqOptions2)
  a.strictEqual(response2.res.statusCode, 200)
  a.ok(/post/.test(response2.data.toString()))

  server.close()
})

runner.test('mock: response function', async function () {
  const port = 8100 + this.index
  const app = new Koa()
  app.use(mockResponse('/test', [
    { request: { method: 'GET' }, response: ctx => ctx.body = 'get' },
    { request: { method: 'POST' }, response: ctx => ctx.body = 'post' }
  ]))
  const server = http.createServer(app.callback())
  await listen(server, port)

  const response = await request(`http://localhost:${port}/test`)
  a.strictEqual(response.res.statusCode, 200)
  a.ok(/get/.test(response.data.toString()))

  const reqOptions2 = url.parse(`http://localhost:${port}/test`)
  reqOptions2.method = 'POST'
  const response2 = await request(reqOptions2)
  a.strictEqual(response2.res.statusCode, 200)
  a.ok(/post/.test(response2.data.toString()))

  server.close()
})

runner.test('mock: response function args', async function () {
  const port = 8100 + this.index
  const app = new Koa()
  app.use(mockResponse('/test/:one', [
    { request: { method: 'GET' }, response: (ctx, one) => ctx.body = one }
  ]))
  const server = http.createServer(app.callback())
  await listen(server, port)

  const response = await request(`http://localhost:${port}/test/yeah`)
  a.strictEqual(response.res.statusCode, 200)
  a.ok(/yeah/.test(response.data.toString()))

  server.close()
})

runner.test('mock: async response function', async function () {
  const port = 8100 + this.index
  const app = new Koa()
  app.use(mockResponse('/test', {
    response: function (ctx) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          ctx.body = 'test'
          resolve()
        }, 10)
      })
    }
  }))
  const server = http.createServer(app.callback())
  await listen(server, port)

  const response = await request(`http://localhost:${port}/test`)
  server.close()
  a.strictEqual(response.res.statusCode, 200)
  a.ok(/test/.test(response.data.toString()))
})
