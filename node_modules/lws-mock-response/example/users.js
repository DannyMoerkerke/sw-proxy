const users = [
  { "id": 1, "name": "Lloyd", "age": 40, "nationality": "English" },
  { "id": 2, "name": "Mona", "age": 34, "nationality": "Palestinian" },
  { "id": 3, "name": "Francesco", "age": 24, "nationality": "Italian" }
]

module.exports = MockBase => class MockUsers extends MockBase {
  mocks () {
    /* response mocks for /users */
    return [
      {
        route: '/users',
        responses: [
          /* Respond with 400 Bad Request for PUT and DELETE requests (inappropriate on a collection) */
          { request: { method: 'PUT' }, response: { status: 400 } },
          { request: { method: 'DELETE' }, response: { status: 400 } },
          {
            /* for GET requests return the collection */
            request: { method: 'GET' },
            /* supports querystring filters `minAge` and `nationality` */
            response: function (ctx) {
              ctx.type = 'json'
              ctx.body = users.filter(user => {
                const meetsMinAge = (user.age || Infinity) >= (Number(ctx.query.minAge) || 0)
                const requiredNationality = user.nationality === (ctx.query.nationality || user.nationality)
                return meetsMinAge && requiredNationality
              })
            }
          },
          {
            /* for POST requests, create a new user and return its location */
            request: { method: 'POST' },
            response: function (ctx) {
              const newUser = ctx.request.body
              users.push(newUser)
              newUser.id = users.length
              ctx.status = 201
              ctx.response.set('Location', `/users/${newUser.id}`)
            }
          }
        ]
      }
    ]
  }
}
