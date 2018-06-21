module.exports = MockBase => class MyMockModule extends MockBase {
  mocks (options) {
    return [
      {
        route: '/pizzas/:id',
        responses: [
          {
            request: {
              method: 'GET',
              accepts: 'json'
            },
            response: {
              type: 'json',
              body: '{ "name": "Margerita" }'
            }
          }
        ]
      }
    ]
  }
}
