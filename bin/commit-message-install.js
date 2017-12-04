#!/usr/bin/env node

'use strict'

const args = require('minimist')(process.argv.slice(2), {
  alias: {
    file: 'f'
  },
  string: 'file'
})

const api = require('..')
const getMessage = api.getMessage
const getJsonBlock = api.getJsonBlock
const npmInstall = api.npmInstall

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
  start = getMessage()
}
start
  .then(getJsonBlock)
  .then(json => {
    if (!json) {
      return
    }
    // alias for API simplicity
    json.packages = json.packages || json.package
    if (json.package) {
      delete json.package
    }
    console.log('got json block from the git commit message')
    console.log(JSON.stringify(json, null, 2))
    return npmInstall(json)
  })
  .catch(onError)
