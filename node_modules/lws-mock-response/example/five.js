module.exports = MockBase => class Five extends MockBase {
  mock () {
    return [
      {
        route: "/",
        responses: [
          { response: { body: "<h1>Welcome to the Mock Responses example</h1>" } }
        ]
      },
      {
        route: "/one",
        responses: [
          {
            response: {
              type: "text/plain",
              body: "<h1>Welcome to the Mock Responses example</h1>"
            }
          }
        ]
      },
      {
        route: "/two",
        responses: [
          {
            request: { accepts: "xml" },
            response: {
              body: "<result id='2' name='whatever' />"
            }
          }
        ]
      },
      {
        route: "/three",
        responses: [
          {
            request: { method: "GET" },
            response: { body: "<h1>Mock response for 'GET' request on /three</h1>" }
          },
          {
            request: { method: "POST" },
            response: {
              status: 400,
              body: { "message": "That method is not allowed." }
            }
          }
        ]
      },
      {
        route: '/five/:id',
        responses: [
          {
            response: function (ctx, id) {
              ctx.body = `<h1>id: ${id}, name: ${ctx.query.name}</h1>`
            }
          }
        ]
      }
    ]
  }
}
