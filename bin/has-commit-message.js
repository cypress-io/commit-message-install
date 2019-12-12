#!/usr/bin/env node

'use strict'

// exits with 0 if there is a commit JSON message
// exits with 1 if there is NO commit JSON message

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
      console.log('cannot find JSON install block')
      process.exit(1)
    }
    console.log('found JSON install block')
    process.exit(0)
  })
  .catch(onError)
