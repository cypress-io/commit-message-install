#!/usr/bin/env node

const args = require('minimist')(process.argv.slice(2), {
  alias: {
    file: 'f'
  },
  string: 'file'
})
const { getMessage, getJsonBlock, npmInstall } = require('..')

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
    return
  }
  if (json) {
    console.log('got json block from the git commit message')
    console.log(JSON.stringify(json, null, 2))
    return npmInstall(json)
  }
}, console.error)
