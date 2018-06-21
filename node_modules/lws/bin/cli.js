#!/usr/bin/env node
const util = require('../lib/util')

if (util.validNodeVersion('7.6.0')) {
  require('../lib/cli-app').run()
} else {
  console.log('Sorry, this app requires node v7.6.0 or above. Please upgrade https://nodejs.org/en/')
}
