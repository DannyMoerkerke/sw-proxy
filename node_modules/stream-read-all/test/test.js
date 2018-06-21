const TestRunner = require('test-runner')
const a = require('assert')
const streamReadAll = require('../')
const fs = require('fs')

const runner = new TestRunner()

runner.test('buffer mode', function () {
  const stream = fs.createReadStream('./package.json')
  return streamReadAll(stream)
    .then(result => {
      a.ok(JSON.parse(result))
    })
})

runner.test('object mode', function () {
  const PassThrough = require('stream').PassThrough
  const stream = new PassThrough({ objectMode: true })
  process.nextTick(() => {
    stream.write({})
    stream.end({})
  })
  return streamReadAll(stream, { objectMode: true })
    .then(result => {
      a.strictEqual(result.length, 2)
    })
})
