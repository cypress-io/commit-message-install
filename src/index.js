'use strict'

const debug = require('debug')('commit-message-install')
const la = require('lazy-ass')
const is = require('check-more-types')
const os = require('os')
const execa = require('execa')
const chalk = require('chalk')
const getInstallJson = require('./get-install-json')
const isNpmInstall = require('./utils').isNpmInstall

const prop = name => object => object[name]

function getMessage (sha) {
  debug('getting last git commit message body')
  const currentMessageCommand = 'git show -s --pretty=%b'
  const cmd = is.unemptyString(sha)
    ? currentMessageCommand + ' ' + sha
    : currentMessageCommand
  debug('git command "%s"', cmd)
  return execa.shell(cmd).then(prop('stdout'))
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
  debug('extracting JSON from message below')
  debug(message)
  debug('--- end of message ---')
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

const isRunIf = is.schema({
  platform: is.maybe.unemptyString,
  env: is.maybe.object
})

function isPlatformAllowed (platform, osPlatform) {
  if (!osPlatform) {
    osPlatform = os.platform()
  }
  if (!platform) {
    return true
  }
  debug('checking platform, allowed platform is', platform)
  la(is.unemptyString(platform), 'invalid allowed platform', platform)
  return platform === '*' || platform.indexOf(osPlatform) !== -1
}

function clone (x) {
  return JSON.parse(JSON.stringify(x))
}

function includes (list, value) {
  return list.indexOf(value) !== -1
}

function getCommand (args) {
  la(is.array(args), 'expected arguments', args)
  const cloned = clone(args)
  const flags = ['-f', '--file']
  if (includes(flags, cloned[0])) {
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

  const osPlatform = os.platform()
  if (!isPlatformAllowed(json.platform, osPlatform)) {
    console.log('Required platform: %s', chalk.green(json.platform))
    console.log('Current platform: %s', chalk.red(osPlatform))
    console.log('skipping command ⏩  %s', command)
    return Promise.resolve()
  }
  console.log('Platform %s is allowed', chalk.green(osPlatform))

  const options = {
    env: json.env,
    stdio: 'inherit'
  }
  return execa.shell(command, options)
}

function npmInstall (json) {
  if (!json) {
    debug('missing json for npm install')
    return Promise.resolve()
  }
  la(isNpmInstall(json), 'invalid JSON to install format', json)

  const osPlatform = os.platform()
  if (!isPlatformAllowed(json.platform, osPlatform)) {
    console.log('Required platform: %s', chalk.green(json.platform))
    console.log('Current platform: %s', chalk.red(osPlatform))
    console.log('skipping NPM install')
    return Promise.resolve()
  }
  console.log('Platform %s is allowed', chalk.green(osPlatform))

  const env = json.env || {}
  console.log('installing', json.packages)
  if (is.not.empty(env)) {
    console.log('with extra environment variables')
    console.log(env)
  }
  if (json.packages.indexOf(',') !== -1) {
    console.log('warning: list of packages includes commas')
    console.log('npm install might not work!')
    console.log(json.packages)
  }
  return execa('npm', ['install', json.packages], {
    env,
    stdio: 'inherit'
  })
}

// looks at the current Git message,
// extracts JSON block
function getJsonFromGit () {
  return getMessage().then(getJsonBlock)
}

module.exports = {
  getMessage,
  getCommand,
  runIf,
  isPlatformAllowed,
  getJsonBlock,
  npmInstall,
  getInstallJson,
  getJsonFromGit
}
