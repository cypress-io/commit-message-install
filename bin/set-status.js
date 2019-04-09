#!/usr/bin/env node

'use strict'

// sets given commit status based on the JSON block in the commit message

const chalk = require('chalk')
const os = require('os')
const debug = require('debug')('commit-message-install')
const { GitHub } = require('gh-app-set-commit-status')
const is = require('check-more-types')

const hasStatusFields = is.schema({
  owner: is.unemptyString,
  repo: is.unemptyString,
  sha: is.commitId,
  context: is.unemptyString
})
const isValidCommitState = is.oneOf(Object.keys(GitHub.StatusState))

const allArgs = process.argv.slice(2)
const args = require('minimist')(allArgs, {
  alias: {
    file: 'f',
    state: 's',
    description: 'd',
    context: 'c'
  },
  string: ['file', 'state', 'description', 'context', 'url']
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
  start = getMessage()
}
start
  .then(getJsonBlock)
  .then(json => {
    if (!json) {
      console.log('there is no JSON block, nothing to set')
      return
    }
    if (!json.status) {
      console.log('JSON commit object does not have status block')
      return
    }
    if (!hasStatusFields(json.status)) {
      console.log('missing all required fields in the status object')
      console.log(json.status)
      return
    }
    const state = args.state || GitHub.StatusState.pending
    if (!isValidCommitState(state)) {
      console.error('invalid commit state "%s"', state)
      console.error('only valid states are', Object.keys(GitHub.StatusState))
      process.exit(1)
    }

    console.log('got json block from the git commit message')
    console.log(JSON.stringify(json, null, 2))

    const osPlatform = os.platform()
    if (!api.isPlatformAllowed(json.platform, osPlatform)) {
      console.log('Required platform: %s', chalk.green(json.platform))
      console.log('Current platform: %s', chalk.red(osPlatform))
      console.log('skipping commit status ⏩')
      return
    }
    console.log('Platform %s is allowed', chalk.green(osPlatform))

    const params = GitHub.getFromEnvironment()
    const gh = GitHub.createGithubAppClient(params)

    const options = {
      owner: json.status.owner,
      repo: json.status.repo,
      sha: json.status.sha,
      state: args.state,
      description: args.description,
      context: args.context || json.status.context,
      targetUrl: args.url
    }
    debug('setting commit status %o', options)
    return GitHub.setCommitStatus(options, gh)
  })
  .catch(onError)
