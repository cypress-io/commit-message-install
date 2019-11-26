#!/usr/bin/env node

'use strict'

const debug = require('debug')('commit-message-install')
const utils = require('../src/utils')

const api = require('..')
const getMessage = api.getMessage
const getJsonBlock = api.getJsonBlock
const npmInstall = api.npmInstall

function onError (e) {
  console.error(e)
  process.exit(1)
}

function commitMessageInstall (cliArguments) {
  if (!cliArguments) {
    cliArguments = process.argv.slice(2)
  }

  const args = require('minimist')(cliArguments, {
    alias: {
      file: 'f',
      sha: 'commit'
    },
    string: ['file', 'else', 'sha']
  })

  let start
  if (args.file) {
    console.log('loading message from file', args.file)
    const fs = require('fs')
    const message = fs.readFileSync(args.file, 'utf8')
    start = Promise.resolve(message)
  } else {
    start = getMessage(args.sha)
  }
  return start
    .then(getJsonBlock)
    .then(json => {
      if (!json) {
        debug('nothing to do from the commit message')
        if (args.else) {
          debug('have --else command')
          debug(args.else)
          const options = {
            stdio: 'inherit',
            shell: true
          }
          return utils.callExeca(args.else, [], options)
        }
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
}

if (!module.parent) {
  commitMessageInstall()
}

module.exports = commitMessageInstall
