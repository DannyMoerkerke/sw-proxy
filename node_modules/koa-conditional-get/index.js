
'use strict';

/**
 * Expose `conditional`.
 */

module.exports = conditional;

/**
 * Conditional GET support middleware.
 *
 * @return {Function}
 * @api public
 */

function conditional() {
  return function conditional(ctx, next) {
    return next().then(() => {
      if (ctx.fresh) {
        ctx.status = 304;
        ctx.body = null;
      }
    });
  }
}
