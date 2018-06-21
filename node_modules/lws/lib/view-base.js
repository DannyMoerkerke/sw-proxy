class View {
  constructor (options) {
    this.options = options
    this.events = []
  }

  addEvent (evt) {
    this.events.push(evt)
  }

  write (key, value) {
    this.addEvent({key, value})
  }

  static load (viewPath) {
    if (typeof viewPath === 'string') {
      const loadModule = require('load-module')
      return loadModule(viewPath)
    }
  }

  printListeningMsg (ipList) {
    const ansi = require('ansi-escape-sequences')
    ipList = ipList
      .map(iface => ansi.format(iface, 'underline'))
      .join(', ')
    console.error(`Serving at ${ipList}`)
  }
}

module.exports = View
