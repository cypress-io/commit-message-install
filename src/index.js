'use strict'

const ggit = require('ggit')

function getMessage () {
  return ggit.lastCommitId().then(ggit.commitMessage)
}

// parses given commit message text (body)
// and finds json block (if any)
/**
  example:

  this commit does this thing
  ```json
  {
    "name": "foo"
  }
  ```
  and more

  returns in the example case object
    {"name": "foo"}
*/
function getJsonBlock (message) {
  if (!message) {
    return
  }
  const jsonStarts = message.indexOf('```json')
  if (jsonStarts === -1) {
    return
  }
  const jsonEnds = message.indexOf('```', jsonStarts + 6)
  if (jsonEnds === -1) {

  }
}

module.exports = { getMessage, getJsonBlock }
