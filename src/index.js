'use strict'

const ggit = require('ggit')
const debug = require('debug')('commit-message-install')
const la = require('lazy-ass')
const is = require('check-more-types')
const os = require('os')
const execa = require('execa')

const prop = name => object => object[name]

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

const isRunIf = is.schema({
  platform: is.maybe.unemptyString,
  env: is.maybe.object
})

function isPlatformAllowed (platform, osPlatform = os.platform()) {
  if (!platform) {
    return true
  }
  debug('checking platform, allowed platform is', platform)
  la(is.unemptyString(platform), 'invalid allowed platform', platform)
  return platform === '*' || platform.indexOf(osPlatform) !== -1
}

function getCommand (args) {
  la(is.array(args), 'expected arguments', args)
  const cloned = [...args]
  const flags = ['-f', '--file']
  if (flags.includes(cloned[0])) {
    debug('found flag', cloned[0])
    cloned.shift()
    cloned.shift()
  }
  const command = cloned.join(' ')
  debug('found command', command)
  return command
}

function runIf (command, json) {
  la(is.unemptyString(command), 'missing command to run', command)
  la(isRunIf(json), 'invalid runIf json', json)

  if (!isPlatformAllowed(json.platform, os.platform())) {
    console.log('Required platform: %s', json.platform)
    console.log('Current platform: %s', os.platform())
    console.log('skipping command')
    return Promise.resolve()
  }

  const options = {
    env: json.env,
    stdio: 'inherit'
  }
  return execa.shell(command, options).then(prop('stdout'))
}

function npmInstall (json) {
  if (!json) {
    debug('missing json for npm install')
    return Promise.resolve()
  }
  la(isNpmInstall(json), 'invalid JSON to install format', json)

  if (!isPlatformAllowed(json.platform, os.platform())) {
    console.log('Required platform: %s', json.platform)
    console.log('Current platform: %s', os.platform())
    console.log('skipping install')
    return Promise.resolve()
  }

  const env = json.env || {}
  console.log('installing', json.packages)
  if (is.not.empty(env)) {
    console.log('with extra environment variables')
    console.log(env)
  }
  return execa('npm', ['install', json.packages], {
    env,
    stdio: 'inherit'
  }).then(prop('stdout'))
}

module.exports = {
  getMessage,
  getCommand,
  runIf,
  isPlatformAllowed,
  getJsonBlock,
  npmInstall
}
