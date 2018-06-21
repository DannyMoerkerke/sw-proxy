'use strict'
const Clf = require('common-log-format')
const view = require('./view')
const stats = require('./stats')
const JSONStream = require('JSONStream')
const streamVia = require('stream-via')
const throttle = require('lodash.throttle')

module.exports = streamLogStats

function streamLogStats (options) {
  options = options || {}
  const throttledRender = throttle(view.render, options.refreshRate || 500)

  function renderLogObject (logObject) {
    const requestSplit = logObject.request.split(' ')
    stats.addBytes(logObject.bytes)
    stats.requests++
    stats.addClient(logObject.remoteHost)
    let resourceLine
    try {
      resourceLine = decodeURI(requestSplit[1])
    } catch (err) {
      resourceLine = requestSplit[1]
    }

    stats.addResource(logObject.status + ' ' + requestSplit[0] + ' ' + resourceLine, logObject.bytes)

    throttledRender(stats)
    return logObject
  }

  const clf = new Clf(options)
  clf
    .pipe(JSONStream.parse())
    .pipe(streamVia(renderLogObject, { objectMode: true }))
    .resume()
  return clf
}
