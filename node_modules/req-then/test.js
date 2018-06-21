'use strict'
const TestRunner = require('test-runner')
const request = require('./')
const a = require('assert')

const runner = new TestRunner()

runner.test('http, string url', function () {
  return request('http://www.bbc.co.uk')
    .then(function (response) {
      a.strictEqual(response.res.statusCode, 200)
    })
})

runner.test('https, string url', function () {
  return request('https://www.bbc.co.uk')
    .then(function (response) {
      a.strictEqual(response.res.statusCode, 200)
    })
})

runner.test('http, reqOptions', function () {
  const url = require('url')
  return request(url.parse('http://www.bbc.co.uk'))
    .then(function (response) {
      a.strictEqual(response.res.statusCode, 200)
    })
})

runner.test('https, reqOptions', function () {
  const url = require('url')
  return request(url.parse('https://www.bbc.co.uk'))
    .then(function (response) {
      a.strictEqual(response.res.statusCode, 200)
    })
})

runner.test('bad: no reqOptions', function () {
  return request()
    .catch(err => {
      if (/need a URL or request options object/.test(err.message)) {
        return 'correct message'
      } else {
        throw err
      }
    })
})

runner.test('bad: no scheme', function () {
  return request('www.bbc.co.uk')
    .catch(err => {
      if (/Protocol missing from request/.test(err.message)) {
        return 'correct message'
      } else {
        throw err
      }
    })
})

runner.skip('bad: bad url', function () {
  return request('http://www.khkalsjnkfjk43674378578234587246786.co.uk')
    .then(response => console.error(require('util').inspect(response, { depth: 6, colors: true })))
})

runner.skip('SSE stream', function () {
  return request('http://127.0.0.1:8000/sse')
    .then(response => {
      console.error(require('util').inspect(response, { depth: 6, colors: true }))
    })
})
