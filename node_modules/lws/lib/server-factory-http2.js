module.exports = ServerFactory => class Http2ServerFactory extends ServerFactory {
  create (options) {
    const util = require('./util')
    if (!util.validNodeVersion('8.4.0')) {
      throw new Error('--http2 requires node version 8.4.0 or above')
    }
    const fs = require('fs')
    const http2 = require('http2')
    const t = require('typical')
    const serverOptions = {}
    if (options.pfx) {
      serverOptions.pfx = fs.readFileSync(options.pfx)
    } else {
      if (options.key && options.cert) {
        serverOptions.key = fs.readFileSync(options.key)
        serverOptions.cert = fs.readFileSync(options.cert)
      } else {
        serverOptions.key = fs.readFileSync(this.getDefaultKeyPath())
        serverOptions.cert = fs.readFileSync(this.getDefaultCertPath())
      }
    }
    if (t.isDefined(options.maxConnections)) throw new Error('--max-connections has no effect with http2')
    if (t.isDefined(options.keepAliveTimeout)) throw new Error('--keep-alive-timeout has no effect with http2')
    this.emit('verbose', 'server.config', serverOptions)
    return http2.createSecureServer(serverOptions)
  }
}
