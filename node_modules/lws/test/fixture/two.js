module.exports = Base => class extends Base {
  middleware (options) {
    return (ctx, next) => {
      ctx.body = (ctx.body || '') + 'two'
    }
  }
  optionDefinitions () {
    return [ { name: 'something' }]
  }
}
