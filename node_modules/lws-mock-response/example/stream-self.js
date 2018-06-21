const fs = require('fs')

module.exports = {
  route: '/stream',
  responses: [
    { response: { body: fs.createReadStream(__filename) }}
  ]
}
