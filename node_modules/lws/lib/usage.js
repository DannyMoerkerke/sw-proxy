const UsageStats = require('usage-stats')
const os = require('os')
const t = require('typical')
const arrayify = require('array-back')

class Usage extends UsageStats {
  constructor () {
    super('UA-70853320-8', {
      an: 'lws',
      av: require('../package').version
    })

    this.defaults
      .set('cd1', process.version)
      .set('cd2', os.type())
      .set('cd3', os.release())
      .set('cd4', 'api')
  }

  screen (name, options) {
    this.screenView(name)
    for (const prop in options) {
      this.event('option', prop, { hitParams: { cd: name } })
    }
    if (options.stack) {
      for (const mw of options.stack) {
        this.event('stack', mw.constructor.name, { hitParams: { cd: name } })
      }
    }
    return this.send()
  }

  send () {
    return super.send().catch(err => { /* disregard errors */ })
    // return this.debug().then(res => console.error(require('util').inspect(res, { depth: 6, colors: true })))
  }

  fail (err) {
    this.exception({ exd: err.message, hitParams: { cd: 'listen' } })
    this.exception({ exd: err.stack, hitParams: { cd: 'listen-stack' } })
    this.send()
  }
}

module.exports = new Usage()
