'use strict'
const TestRunner = require('test-runner')
const util = require('../lib/util')
const a = require('assert')

const runner = new TestRunner()

runner.test('deepMerge', function () {
  const result = util.deepMerge(
    { port: 8000 },
    { stack: [ 'one' ] },
    { stack: [ 'two' ], help: true }
  )
  a.deepStrictEqual(result, {
    port: 8000,
    stack: [ 'two' ],
    help: true
  })
})

runner.test('deepMerge: arrays', function () {
  let result = util.deepMerge(
    { stack: [ 'one' ] },
    { stack: [] }
  )
  a.deepStrictEqual(result, {
    stack: [ 'one' ]
  })
})

runner.test('deepMerge: arrays 2', function () {
  let result = util.deepMerge(
    { stack: [] },
    { stack: [ 'one' ] }
  )
  a.deepStrictEqual(result, {
    stack: [ 'one' ]
  })
})

runner.test('deepMerge: arrays 3', function () {
  let result = util.deepMerge(
    { stack: [ 'two' ] },
    { stack: [ 'one' ] }
  )
  a.deepStrictEqual(result, {
    stack: [ 'one' ]
  })
})
