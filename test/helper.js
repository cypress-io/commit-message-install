const debug = require('debug')('test')
const sinon = require('sinon')
beforeEach(() => {
  debug('root level beforeEach, creating sandbox')
  if (global.sandbox) {
    global.sandbox.restore()
  }
  global.sandbox = sinon.createSandbox()
})
