/**
 * @module lws
 */

const util = require('./util')
const t = require('typical')
const EventEmitter = require('events')
const arrayify = require('array-back')
const usage = require('./usage')
const loadModule = require('load-module')

/**
 * @alias module:lws
 * @emits verbose
 */
class Lws extends EventEmitter {
  propagate (from) {
    from.on('verbose', (key, value) => this.emit('verbose', key, value))
  }

  /**
   * Returns a listening HTTP/HTTPS server.
   * @param [options] {object} - Server options
   * @param [options.port] {number} - Port
   * @param [options.hostname] {string} -The hostname (or IP address) to listen on. Defaults to 0.0.0.0.
   * @param [options.maxConnections] {number} - The maximum number of concurrent connections supported by the server.
   * @param [options.keepAliveTimeout] {number} - The period (in milliseconds) of inactivity a connection will remain open before being destroyed. Set to `0` to keep connections open indefinitely.
   * @param [options.configFile] {string} - Config file path, defaults to 'lws.config.js'.
   * @param [options.https] {boolean} - Enable HTTPS using a built-in key and cert registered to the domain 127.0.0.1.
   * @param [options.key] {string} - SSL key file path. Supply along with --cert to launch a https server.
   * @param [options.cert] {string} - SSL cert file path. Supply along with --key to launch a https server.
   * @param [options.pfx] {string} - Path to an PFX or PKCS12 encoded private key and certificate chain. An alternative to providing --key and --cert.
   * @param [options.ciphers] {string} - Optional cipher suite specification, replacing the default.
   * @param [options.secureProtocol] {string} - Optional SSL method to use, default is "SSLv23_method".
   * @param [options.stack] {string[]|Middlewares[]} - Array of feature classes, or filenames of modules exporting a feature class.
   * @param [options.server] {string|ServerFactory} - Custom server factory, e.g. lws-http2.
   * @param [options.websocket] {string|Websocket} - Path to a websocket module
   * @param [options.moduleDir] {string[]} - One or more directories to search for feature modules.
   * @returns {Server}
   */
  listen (options) {
    options = Object.assign({
      port: 8000,
      modulePrefix: 'lws-'
     }, options)

    const server = this.createServer(options)
    if (t.isDefined(options.maxConnections)) server.maxConnections = options.maxConnections
    if (t.isDefined(options.keepAliveTimeout)) server.keepAliveTimeout = options.keepAliveTimeout
    /* attach to view to server */
    createServerEventStream(server, options)
    this.propagate(server)

    if (options.stack) {
      options.stack = arrayify(options.stack)

      /* validate stack */
      const Stack = require('./stack')
      if (!(options.stack instanceof Stack)) {
        options.stack = Stack.create(options.stack, options)
      }
      /* propagate stack middleware events */
      this.propagate(options.stack)

      /* build Koa application, add it to server */
      const Koa = require('koa')
      const app = new Koa()
      app.on('error', err => {
        this.emit('verbose', 'koa.error', err)
        const usage = require('./usage')
        usage.fail(err)
      })
      const middlewares = options.stack.getMiddlewareFunctions(options)
      middlewares.forEach(middleware => app.use(middleware))
      server.on('request', app.callback())
    }

    /* websocket */
    if (options.websocket) {
      this.attachWebsocket(server, options)
    }

    /* start server */
    server.listen(options.port, options.hostname)

    /* emit memory usage stats every 30s */
    const interval = setInterval(() => {
      const byteSize = require('byte-size')
      const memUsage = process.memoryUsage()
      memUsage.rss = byteSize(memUsage.rss).toString()
      memUsage.heapTotal = byteSize(memUsage.heapTotal).toString()
      memUsage.heapUsed = byteSize(memUsage.heapUsed).toString()
      memUsage.external = byteSize(memUsage.external).toString()
      this.emit('verbose', 'process.memoryUsage', memUsage)
      usage.event('other', 'ping')
      usage.send()
    }, 60000)
    interval.unref()

    usage.screen('listen', options)
    return server
  }

  /**
   * Returns a nodejs Server instance.
   * @returns {Server}
   * @ignore
   */
  createServer (options) {
    /* validation */
    if ((options.key && !options.cert) || (!options.key && options.cert)) {
      throw new Error('--key and --cert must always be supplied together.')
    } else if (options.https && options.pfx) {
      throw new Error('please use one of --https or --pfx, not both.')
    }

    /* The base HTTP server factory */
    let ServerFactory = require('./server-factory')

    /* use HTTPS server factory */
    if (options.https || (!options.http2 && (options.key && options.cert) || options.pfx)) {
      ServerFactory = require('./server-factory-https')(ServerFactory)
    /* use HTTP2 server factory */
    } else if (options.http2) {
      ServerFactory = require('./server-factory-http2')(ServerFactory)

    /* use user-supplied server factory */
    } else if (options.server) {
      if (util.builtinModules.includes(options.server)) {
        throw new Error('please supply a third party module name to --server, not a node built-in module name')
      }
      const module = loadModule(options.server, options)
      if (t.isFunction(module)) {
        ServerFactory = module(ServerFactory)
      } else {
        throw new Error('Invalid module supplied to --server, it should export a function.')
      }
    }
    const factory = new ServerFactory()
    this.propagate(factory)
    return factory.create(options)
  }

  attachWebsocket (server, options) {
    const WebsocketBase = require('./websocket-base')
    const wsModule = typeof options.websocket === 'string' ? loadModule(options.websocket, options) : options.websocket
    const WebsocketModule = wsModule(WebsocketBase)
    const websocketModule = new WebsocketModule()
    let wsOptions = { perMessageDeflate: false }
    if (websocketModule.wsOptions) {
      wsOptions = Object.assign({}, wsOptions, websocketModule.wsOptions())
    }
    const Websocket = require('ws')
    this.emit('verbose', 'websocket.server.config', wsOptions)
    wsOptions.server = server
    const wss = new Websocket.Server(wsOptions)
    this.propagate(websocketModule)
    let webSocketId = 1
    wss.on('connection', (ws, req) => {
      ws.webSocketId = webSocketId++
      this.emit('verbose', 'websocket.server.connection', { socketId: req.socket.id, webSocketId: ws.webSocketId })
      ws.on('close', (code, reason) => {
        this.emit('verbose', 'websocket.socket.close', { socketId: req.socket.id, webSocketId: ws.webSocketId, code, reason })
      })
      ws.on('message', data => {
        this.emit('verbose', 'websocket.socket.message', {
          socketId: req.socket.id,
          webSocketId: ws.webSocketId,
          data
        })
      })
      ws.on('ping', data => {
        this.emit('verbose', 'websocket.socket.ping', {
          socketId: req.socket.id,
          webSocketId: ws.webSocketId,
          data
        })
      })
      ws.on('pong', data => {
        this.emit('verbose', 'websocket.socket.pong', {
          socketId: req.socket.id,
          webSocketId: ws.webSocketId,
          data
        })
      })
      ws.on('unexpected-response', (req, res) => {
        this.emit('verbose', 'websocket.socket.unexpected-response', {
          socketId: req.socket.id,
          webSocketId: ws.webSocketId
        })
      })
    })
    wss.on('headers', (headers) => {
      this.emit('verbose', 'websocket.server.headers', { headers })
    })
    websocketModule.websocket(wss)
  }
}

/**
 * Pipe server events into 'verbose' event stream
 * @ignore
 */
function createServerEventStream (server, options) {
  function write (name, value) {
    return function () {
      server.emit('verbose', name, value)
    }
  }

  function socketProperties (socket) {
    const byteSize = require('byte-size')
    return {
      socketId: socket.id,
      bytesRead: byteSize(socket.bytesRead).toString(),
      bytesWritten: byteSize(socket.bytesWritten).toString()
    }
  }

  let cId = 1
  server.on('connection', (socket) => {
    socket.id = cId++
    write('server.socket.new', socketProperties(socket))()
    socket.on('connect', write('server.socket.connect', socketProperties(socket, cId)))
    socket.on('data', function () {
      write('server.socket.data', socketProperties(this))()
    })
    socket.on('drain', function () {
      write('server.socket.drain', socketProperties(this))()
    })
    socket.on('timeout', function () {
      write('server.socket.timeout', socketProperties(this))()
    })
    socket.on('close', function () {
      write('server.socket.close', socketProperties(this))()
    })
    socket.on('error', function (err) {
      write('server.socket.error', { err })()
    })
    socket.on('end', write('server.socket.end', socketProperties(socket, cId)))
    socket.on('lookup', write('server.socket.connect', socketProperties(socket, cId)))
  })
  server.on('close', write('server.close'))
  server.on('checkContinue', write('server.checkContinue'))
  server.on('checkExpectation', write('server.checkExpectation'))
  server.on('clientError', (error, socket) => {
    write('server.clientError', error)()
    if (socket) socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })
  server.on('connect', write('server.connect'))
  server.on('upgrade', (req, socket, head) => {
    write('server.upgrade', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      socketId: socket.id,
      head: head.toString()
    })()
  })

  let requestId = 1
  server.on('request', req => {
    req.requestId = requestId++
  })

  /* on server-up message */
  server.on('listening', () => {
    const isSecure = t.isDefined(server.addContext)
    let ipList
    if (options.hostname) {
      ipList = [ `${isSecure ? 'https' : 'http'}://${options.hostname}:${options.port}` ]
    } else {
      ipList = util.getIPList()
        .map(iface => `${isSecure ? 'https' : 'http'}://${iface.address}:${options.port}`)
    }
    write('server.listening', ipList)()
  })
}

module.exports = Lws
