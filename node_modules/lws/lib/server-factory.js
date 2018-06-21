const path = require('path')
const EventEmitter = require('events')

class ServerFactory extends EventEmitter {
  getDefaultKeyPath () {
    return path.resolve(__dirname, '..', 'ssl', 'private-key.pem')
  }
  getDefaultCertPath () {
    return path.resolve(__dirname, '..', 'ssl', 'lws-cert.pem')
  }

  create (options) {
    const t = require('typical')
    const serverOptions = {}
    if (t.isDefined(options.maxConnections)) serverOptions.maxConnections = options.maxConnections
    if (t.isDefined(options.keepAliveTimeout)) serverOptions.keepAliveTimeout = options.keepAliveTimeout
    this.emit('verbose', 'server.config', serverOptions)
    return require('http').createServer()
  }
}

module.exports = ServerFactory
