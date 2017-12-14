#!/usr/bin/env node

'use strict'

// runs any command if commit message
//  a: does not contain JSON
//  b: JSON does not specify a platform that disallows it
// for example if commit message has
//   {"platform": "win32"}
// and CI command has
//   run-if echo "I am running on Windows"
// then Windows CI will show the message, and other CIs
// will skip it

const debug = require('debug')('commit-message-install')

const allArgs = process.argv.slice(2)
const args = require('minimist')(allArgs, {
  alias: {
    file: 'f',
    sha: 'commit'
  },
  string: ['file', 'sha']
})

const api = require('..')
const getMessage = api.getMessage
const getJsonBlock = api.getJsonBlock
const getCommand = api.getCommand
const runIf = api.runIf

const actualCommand = getCommand(allArgs)
debug('command to run:', actualCommand)

function onError (e) {
  console.error(e)
  process.exit(1)
}

let start
if (args.file) {
  console.log('loading message from file', args.file)
  const fs = require('fs')
  const message = fs.readFileSync(args.file, 'utf8')
  start = Promise.resolve(message)
} else {
  start = getMessage(args.sha)
}
start
  .then(getJsonBlock)
  .then(json => {
    if (!json) {
      return runIf(actualCommand, {})
    }
    console.log('got json block from the git commit message')
    console.log(JSON.stringify(json, null, 2))
    return runIf(actualCommand, json)
  })
  .catch(onError)
