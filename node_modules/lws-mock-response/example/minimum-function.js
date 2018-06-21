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
            response: function (ctx, id) {
              ctx.json = 'json'
              ctx.body = `{ "name": "Margerita", "id": ${id} }`
            }
          }
        ]
      }
    ]
  }
}
