module.exports = MiddlewareBase => class MockResponse extends MiddlewareBase {
  description () {
    return 'Mock a response for any given request.'
  }

  optionDefinitions () {
    return [
      {
        name: 'mocks',
        multiple: true,
        typeLabel: '{underline file} {underline ...}',
        description: 'One or more modules exporting Mock Responses.'
      }
    ]
  }

  middleware (options) {
    const arrayify = require('array-back')
    const path = require('path')
    const mockResponse = require('koa-mock-response')
    const loadModule = require('load-module')

    let mocks = arrayify(options.mocks)
    if (mocks && mocks.length) {
      const flatten = require('reduce-flatten')
      mocks = mocks
        .map(mockPath => {
          return typeof mockPath === 'string' ? loadModule(mockPath) : mockPath
        })
        .reduce(flatten, [])

      const mockInstances = mocks
        .map(mockModule => {
          const MockBase = require('./mock-base')
          const Mock = mockModule(MockBase)
          let mock = new Mock()
          this.propagate(mock)
          return mock
        })
      this.emit('verbose', 'middleware.mock-response.config', { mocks: mockInstances })

      const usage = require('lws/lib/usage')
      for (const mock of mockInstances) {
        usage.event('mocks', mock.constructor.name, { hitParams: { cd: 'listen' } })
      }

      /* return an array of middleware */
      return mockInstances
        .map(mock => {
          const mockResponses = arrayify(mock.mocks(options))
          return mockResponses.map(mock => mockResponse(mock.route, mock.responses))
        })
        .reduce(flatten, [])
    }
  }
}
