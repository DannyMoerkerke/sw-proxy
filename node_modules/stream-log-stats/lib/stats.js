'use strict'
const path = require('path')
const urlUtil = require('url')
const byteSize = require('byte-size')

const stats = module.exports = {
  clients: {},
  clientCount: 0,
  bytes: 0,
  transferred: '0',
  requests: 0,
  resource: {},
  type: {},
  topResources: [],
  topTypes: []
}
stats.addClient = function (ip) {
  if (this.clients[ip]) {
    this.clients[ip]++
  } else {
    this.clients[ip] = 1
  }
  this.clientCount = Object.keys(this.clients).length
}
stats.addResource = function (url, bytes) {
  if (stats.resource[url]) {
    stats.resource[url].requests++
    stats.resource[url].bytes += bytes
  } else {
    stats.resource[url] = {
      requests: 1,
      bytes: bytes
    }
  }
  const parsedUrl = urlUtil.parse(url)
  let type = path.extname(parsedUrl.pathname) || '<none>'
  type = type.toLowerCase()
  if (stats.type[type]) {
    stats.type[type].requests++
    stats.type[type].bytes += bytes
  } else {
    stats.type[type] = {
      requests: 1,
      bytes: bytes
    }
  }

  stats.topResources = []
  stats.topTypes = []
  Object.keys(stats.resource).forEach(function (key) {
    const resource = stats.resource[key]
    const bytes = byteSize(resource.bytes, { units: 'iec', precision: 2 })
    stats.topResources.push({
      resource: key,
      requests: resource.requests,
      bytes: `${bytes.value} ${bytes.unit}`
    })
  })
  Object.keys(stats.type).forEach(function (key) {
    const type = stats.type[key]
    const bytes = byteSize(type.bytes, { units: 'iec', precision: 2 })
    stats.topTypes.push({
      type: key,
      requests: type.requests,
      bytes: `${bytes.value} ${bytes.unit}`
    })
  })

  stats.topResources = stats.topResources.sort(function (a, b) {
    return b.requests - a.requests
  })
  stats.topTypes = stats.topTypes.sort(function (a, b) {
    return b.requests - a.requests
  })
}
stats.addBytes = function (bytes) {
  this.bytes += bytes
  const b = byteSize(this.bytes, { units: 'iec', precision: 2 })
  this.transferred = `${b.value} ${b.unit}`
}
