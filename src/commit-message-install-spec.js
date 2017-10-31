'use strict'

/* eslint-env mocha */
const { getMessage, getJsonBlock } = require('.')
const schemaShot = require('schema-shot')
const la = require('lazy-ass')
const is = require('check-more-types')

describe('commit-message-install', () => {
  context('gets last commit message', () => {
    it('returns an object', () => {
      return schemaShot(getMessage())
    })
  })

  context('getJsonBlock', () => {
    it('is a function', () => {
      la(is.fn(getJsonBlock))
    })
  })
})
