#!/usr/bin/env node

const { getMessage } = require('..')
getMessage().then(console.log, console.error)
