'use strict'

const ggit = require('ggit')

function getMessage () {
  return ggit.lastCommitId().then(ggit.commitMessage)
}

module.exports = { getMessage }
