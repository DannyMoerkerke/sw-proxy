'use strict'
const Transform = require('stream').Transform

/**
 * @module stream-read-all
 */
module.exports = streamReadAll

class StreamReader extends Transform {
  constructor (options) {
    super(options)
    this.options = options || {}
    if (this.options.objectMode) {
      this.buf = []
    } else {
      this.buf = Buffer.alloc ? Buffer.alloc(0) : new Buffer(0)
    }
  }

  _transform (chunk, enc, done) {
    if (chunk) {
      if (this.options.objectMode) {
        this.buf.push(chunk)
      } else {
        this.buf = Buffer.concat([ this.buf, chunk ])
      }
    }
    done()
  }

  _flush (done) {
    this.push(this.buf)
    this.push(null)
    done()
  }
}

/**
 * @return {Promise}
 * @alias module:stream-read-all
 */
function streamReadAll (stream, options) {
  const streamReader = new StreamReader(options)
  stream.pipe(streamReader)
  return new Promise((resolve, reject) => {
    streamReader.resume()
    streamReader.on('end', () => {
      resolve(streamReader.buf)
    })
    streamReader.on('error', (err) => {
      reject(err)
    })
  })
}
