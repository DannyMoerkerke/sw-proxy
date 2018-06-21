const users = [
  { "id": 1, "name": "Lloyd", "age": 40, "nationality": "English" },
  { "id": 2, "name": "Mona", "age": 34, "nationality": "Palestinian" },
  { "id": 3, "name": "Francesco", "age": 24, "nationality": "Italian" }
]

module.exports = MockBase => class MockUsers extends MockBase {
  mocks () {
    return [
      {
        route: "/users/:id",
        responses: [
          /* no support for POST on this route */
          { request: { method: 'POST' }, response: { status: 400 } },

          /* for GET requests, return a particular user */
          {
            request: { method: 'GET' },
            response: (ctx, id) => {
              ctx.body = users.find(user => user.id === Number(id))
            }
          },

          /* for PUT requests, update the record */
          {
            request: { method: 'PUT', is: 'json', accepts: 'json' },
            response: (ctx, id) => {
              const updatedUser = ctx.request.body
              const existingUserIndex = users.findIndex(user => user.id === Number(id))
              users.splice(existingUserIndex, 1, updatedUser)
              ctx.status = 204
            }
          },

          /* DELETE request: remove the record */
          {
            request: { method: 'DELETE' },
            response: (ctx, id) => {
              const existingUserIndex = users.findIndex(user => user.id === Number(id))
              users.splice(existingUserIndex, 1)
              ctx.status = 204
            }
          }
        ]
      }
    ]
  }
}
