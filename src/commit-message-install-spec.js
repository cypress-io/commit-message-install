'use strict'

/* eslint-env mocha */
const { getMessage } = require('.')
const schemaShot = require('schema-shot')

describe('commit-message-install', () => {
  context('gets last commit message', () => {
    it('returns an object', () => {
      return schemaShot(getMessage())
    })
  })
})
