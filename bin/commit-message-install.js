#!/usr/bin/env node

const { getMessage, getJsonBlock } = require('..')
getMessage()
  .then(x => x.body)
  .then(getJsonBlock)
  .then(json => {
    if (json) {
      console.log('got json block from the git commit message')
      console.log(JSON.stringify(json, null, 2))
    }
  }, console.error)
