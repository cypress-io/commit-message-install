#!/usr/bin/env node

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
    file: 'f'
  },
  string: 'file'
})
const { getMessage, getCommand, getJsonBlock, runIf } = require('..')

const actualCommand = getCommand(allArgs)
debug('command to run:', actualCommand)

let start
if (args.file) {
  console.log('loading message from file', args.file)
  const fs = require('fs')
  const message = fs.readFileSync(args.file, 'utf8')
  start = Promise.resolve(message)
} else {
  start = getMessage().then(x => x.body)
}
start.then(getJsonBlock).then(json => {
  if (!json) {
    return runIf(actualCommand)
  }
  console.log('got json block from the git commit message')
  console.log(JSON.stringify(json, null, 2))
  return runIf(actualCommand, json)
}, console.error)
