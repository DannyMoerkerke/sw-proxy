const EventEmitter = require('events')

class WebsocketBase extends EventEmitter {
  websocket (wss) {
    throw new Error('not implemented')
  }
}

module.exports = WebsocketBase
