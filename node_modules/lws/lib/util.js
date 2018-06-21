'use strict'

/**
 * @module util
 */

exports.deepMerge = deepMerge
exports.printError = printError
exports.getIPList = getIPList
exports.validNodeVersion = validNodeVersion

function deepMerge (...args) {
  const assignWith = require('lodash.assignwith')
  const t = require('typical')

  function customiser (previousValue, newValue, key, object, source) {
    /* deep merge plain objects */
    if (t.isPlainObject(previousValue) && t.isPlainObject(newValue)) {
      return assignWith(previousValue, newValue, customiser)
    /* overwrite arrays if the new array has items */
    } else if (Array.isArray(previousValue) && Array.isArray(newValue) && newValue.length) {
      return newValue.slice()
    /* ignore incoming arrays if empty */
    } else if (Array.isArray(newValue) && !newValue.length) {
      return Array.isArray(previousValue) ? previousValue.slice() : previousValue
    } else if (!t.isDefined(previousValue) && Array.isArray(newValue)) {
      return newValue.slice()
    }
  }

  return assignWith(...args, customiser)
}

function printError (err, title) {
  const ansi = require('ansi-escape-sequences')
  const now = new Date()
  const time = now.toLocaleTimeString()
  if (title) console.error(ansi.format(`${time}: [underline red]{${title}}`))
  console.error(ansi.format(err.stack, 'red'))
}

/**
 * Returns an array of available IPv4 network interfaces
 * @example
 * [ { address: 'mbp.local' },
 *  { address: '127.0.0.1',
 *    netmask: '255.0.0.0',
 *    family: 'IPv4',
 *    mac: '00:00:00:00:00:00',
 *    internal: true },
 *  { address: '192.168.1.86',
 *    netmask: '255.255.255.0',
 *    family: 'IPv4',
 *    mac: 'd0:a6:37:e9:86:49',
 *    internal: false } ]
 */
function getIPList () {
  const os = require('os')
  const flatten = require('reduce-flatten')

  let ipList = Object.keys(os.networkInterfaces())
    .map(key => os.networkInterfaces()[key])
    .reduce(flatten, [])
    .filter(iface => iface.family === 'IPv4')
  ipList.unshift({ address: os.hostname() })
  return ipList
}

/* this data is built into node versions 9.3 and above */
exports.builtinModules = [
  'async_hooks',
  'assert',
  'buffer',
  'child_process',
  'console',
  'constants',
  'crypto',
  'cluster',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  '_http_agent',
  '_http_client',
  '_http_common',
  '_http_incoming',
  '_http_outgoing',
  '_http_server',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  '_stream_readable',
  '_stream_writable',
  '_stream_duplex',
  '_stream_transform',
  '_stream_passthrough',
  '_stream_wrap',
  'string_decoder',
  'sys',
  'timers',
  'tls',
  '_tls_common',
  '_tls_legacy',
  '_tls_wrap',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
  'v8/tools/splaytree',
  'v8/tools/codemap',
  'v8/tools/consarray',
  'v8/tools/csvparser',
  'v8/tools/profile',
  'v8/tools/profile_view',
  'v8/tools/logreader',
  'v8/tools/tickprocessor',
  'v8/tools/SourceMap',
  'v8/tools/tickprocessor-driver',
  'node-inspect/lib/_inspect',
  'node-inspect/lib/internal/inspect_client',
  'node-inspect/lib/internal/inspect_repl'
]

function validNodeVersion (version) {
  var valid = false
  try {
    const semver = require('semver')
    valid = semver.gte(require('process').version, version)
  } catch (err) {}
  return valid
}
