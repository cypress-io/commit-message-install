'use strict'

const ggit = require('ggit')
const debug = require('debug')('commit-message-install')
const la = require('lazy-ass')
const is = require('check-more-types')
const os = require('os')

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
    debug('no message to process')
    return
  }
  la(is.unemptyString(message), 'expected string message, got', message)

  const start = '```json'
  const jsonStarts = message.indexOf(start)
  if (jsonStarts === -1) {
    debug('could not find json start')
    return
  }
  const jsonBlockAt = jsonStarts + start.length
  const jsonEnds = message.indexOf('```', jsonBlockAt)
  if (jsonEnds === -1) {
    debug('could not find json end')
    return
  }

  debug('json starts at position', jsonBlockAt)
  debug('json ends at position', jsonEnds)
  const jsonTextLength = jsonEnds - jsonBlockAt
  const jsonText = message.substr(jsonBlockAt, jsonTextLength)
  try {
    return JSON.parse(jsonText)
  } catch (e) {
    debug('could not parse json text')
    debug('---')
    debug(jsonText)
    debug('---')
  }
}

// to install multiple packages, use comma-separated list
const isNpmInstall = is.schema({
  platform: is.maybe.unemptyString,
  env: is.maybe.object,
  packages: is.unemptyString
})

function npmInstall (json) {
  if (!json) {
    debug('missing json for npm install')
    return
  }
  la(isNpmInstall(json), 'invalid JSON to install format', json)

  if (json.platform) {
    debug('checking platform, expecting', json.platform)
    la(is.unemptyString(json.platform), 'invalid json platform', json.platform)
    if (json.platform !== os.platform()) {
      console.log('Required platform: %s', json.platform)
      console.log('Current platform: %s', os.platform())
      console.log('skipping install')
    }
  }
}

module.exports = { getMessage, getJsonBlock, npmInstall }
