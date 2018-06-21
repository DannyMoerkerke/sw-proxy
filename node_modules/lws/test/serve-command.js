'use strict'
const TestRunner = require('test-runner')
const ServeCommand = require('../lib/command/serve')
const a = require('assert')
const request = require('req-then')
const usage = require('../lib/usage')
usage.disable()

const runner = new TestRunner()

runner.test('stack initialOptions: one feature', async function () {
  const port = 9300 + this.index
  const One = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        ctx.body = 'one'
      }
    }
  }
  const serve = new ServeCommand()
  const server = serve.execute({
    stack: One,
    port: port
  }, [])
  const response = await request(`http://localhost:${port}`)
  server.close()
  a.strictEqual(response.data.toString(), 'one')
})

runner.test('stack initialOptions: Two features', async function () {
  const port = 9300 + this.index
  const One = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        ctx.body = 'one'
        next()
      }
    }
  }
  const Two = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        ctx.body += 'two'
        next()
      }
    }
  }
  const serve = new ServeCommand()
  const server = serve.execute({
    stack: [ One, Two ],
    port: port
  }, [])
  const response = await request(`http://localhost:${port}`)
  server.close()
  a.strictEqual(response.data.toString(), 'onetwo')
})

runner.test('stack initialOptions: one feature, one path', async function () {
  const port = 9300 + this.index
  const One = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        ctx.body = 'one'
        next()
      }
    }
  }
  const serve = new ServeCommand()
  const server = serve.execute({
    stack: [ One, 'test/fixture/two.js' ],
    port: port
  }, [])
  const response = await request(`http://localhost:${port}`)
  server.close()
  a.strictEqual(response.data.toString(), 'onetwo')
})

runner.test('stack initialOptions and argv: command-line Stack takes precedence', async function () {
  const port = 9300 + this.index
  const One = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        ctx.body = 'one'
        next()
      }
    }
  }
  const serve = new ServeCommand()
  let server = serve.execute({
    stack: [ One ], // One will be overridden by command-line choice of Two
    port: port
  }, [ '--stack', 'test/fixture/two.js' ])
  const response = await request(`http://localhost:${port}`)
  server.close()
  a.strictEqual(response.data.toString(), 'two')
})

runner.test('stack initialOptions and argv: one feature with cli option', async function () {
  const port = 9300 + this.index
  const One = Base => class extends Base {
    middleware (options) {
      return (ctx, next) => {
        ctx.body = options.something
        next()
      }
    }
    optionDefinitions () {
      return [ { name: 'something' }]
    }
  }
  const serve = new ServeCommand()
  let server = serve.execute({
    stack: [ One ],
    port: port
  }, [ '--something', 'yeah' ])
  const response = await request(`http://localhost:${port}`)
  server.close()
  a.strictEqual(response.data.toString(), 'yeah')
})
