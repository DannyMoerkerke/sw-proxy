const TestRunner = require('test-runner')
const Counter = require('test-runner-counter')
const a = require('assert')
const CliApp = require('../lib/cli-app')
const request = require('req-then')
const usage = require('../lib/usage')
usage.disable()

const runner = new TestRunner({ sequential: true })

runner.test('cli.run', async function () {
  const port = 7500 + this.index
  const origArgv = process.argv.slice()
  process.argv = [ 'node', 'something', '--port', `${port}` ]
  const server = CliApp.run()
  process.argv = origArgv
  const response = await request(`http://127.0.0.1:${port}/`)
  server.close()
  a.strictEqual(response.res.statusCode, 404)
})

runner.test('cli.run: bad option, should fail and printError', async function () {
  const port = 7500 + this.index
  const origArgv = process.argv.slice()
  process.argv = [ 'node', 'something', '--should-fail' ]
  const server = CliApp.run()
  process.argv = origArgv
  a.strictEqual(server, undefined)
})

runner.test('cli.run: port not available', async function () {
  const counter = Counter.create(1)
  const port = 7500 + this.index
  const origArgv = process.argv.slice()
  process.argv = [ 'node', 'something', '--port', `${port}` ]
  const server = CliApp.run()
  server.on('error', err => {
    counter.fail('should not reach here')
  })
  const server2 = CliApp.run()
  server2.on('error', err => {
    counter.pass('should fail')
    a.strictEqual(process.exitCode, 1)
    process.exitCode = 0
    server.close()
    server2.close()
  })
  process.argv = origArgv
  return counter.promise
})

runner.test('cli.run: --help', async function () {
  const origArgv = process.argv.slice()
  process.argv = [ 'node', 'something', '--help' ]
  CliApp.run()
  process.argv = origArgv
})

runner.test('cli.run: --version', async function () {
  const origArgv = process.argv.slice()
  process.argv = [ 'node', 'something', '--version' ]
  CliApp.run()
  process.argv = origArgv
})

runner.test('cli.run: --config', async function () {
  const origArgv = process.argv.slice()
  process.argv = [ 'node', 'something', '--config' ]
  CliApp.run()
  process.argv = origArgv
})
