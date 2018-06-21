'use strict'
const TestRunner = require('test-runner')
const UsageStats = require('../')
const a = require('assert')
const runner = new TestRunner()
const shared = require('./lib/shared')

runner.test('no write permission', function () {
  const testStats = new UsageStats('UA-00000000-0', { dir: '/etc/yeah' })
  let result = testStats._getClientId()
  a.strictEqual(result, '<unknown>')
  testStats.dir = shared.getCacheDir(100 + this.index)
  result = testStats._getClientId()
  a.ok(result.length > 10)
})
