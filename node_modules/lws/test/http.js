'use strict'
const TestRunner = require('test-runner')
const Counter = require('test-runner-counter')
const Lws = require('../')
const a = require('assert')
const request = require('req-then')
const usage = require('../lib/usage')
usage.disable()

const runner = new TestRunner()

runner.test('lws: simple http', async function () {
  const port = 9100 + this.index
  const One = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        ctx.body = 'one'
        next()
      }
    }
  }
  const lws = new Lws()
  const server = lws.listen({
    stack: [ One ],
    port: port
  })
  const response = await request(`http://127.0.0.1:${port}`)
  server.close()
  a.strictEqual(response.res.statusCode, 200)
  a.strictEqual(response.data.toString(), 'one')
})

runner.test('lws: hostname', async function () {
  const port = 9100 + this.index
  const One = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        const fs = require('fs')
        ctx.body = fs.createReadStream('package.json')
        next()
      }
    }
  }
  const lws = new Lws()
  const server = lws.listen({
    stack: [ One ],
    port: port,
    hostname: 'localhost'
  })

  try {
    await request(`http://127.0.0.1:${port}`)
    a.fail("shouldn't reach here")
  } catch (err) {
  }

  try {
    const response = await request(`http://localhost:${port}`)
    a.strictEqual(response.res.statusCode, 200)
    server.close()
  } catch (err) {
    a.fail("shouldn't reach here")
  }

})

runner.test('lws: --websocket', async function () {
  const counter = Counter.create(1)
  const port = 9100 + this.index
  const One = Base => class extends Base {
    websocket (wss) {
      wss.on('connection', ws => {
        ws.on('message', data => {
          counter.pass()
        })
      })
    }
  }
  const lws = new Lws()
  const server = lws.listen({
    websocket: One,
    port: port
  })
  const WebSocket = require('ws')
  const ws = new WebSocket(`ws://127.0.0.1:${port}`)

  ws.on('open', function open() {
    ws.send('something')
    server.close()
    ws.close()
  })
  return counter.promise
})

runner.test('lws: --max-connections, --keep-alive-timeout', async function () {
  const port = 9100 + this.index
  const One = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        ctx.body = 'one'
        next()
      }
    }
  }
  const lws = new Lws()
  const server = lws.listen({
    stack: [ One ],
    port: port,
    maxConnections: 10,
    keepAliveTimeout: 10000
  })
  const url = require('url')
  const reqOptions = url.parse(`http://127.0.0.1:${port}`)
  reqOptions.rejectUnauthorized = false
  const response = await request(reqOptions)
  server.close()
  a.strictEqual(response.res.statusCode, 200)
  a.strictEqual(response.data.toString(), 'one')
})
