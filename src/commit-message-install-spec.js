'use strict'

/* eslint-env mocha */
const { getMessage, getJsonBlock } = require('.')
const schemaShot = require('schema-shot')
const la = require('lazy-ass')
const is = require('check-more-types')
const { stripIndent } = require('common-tags')
const snapshot = require('snap-shot-it')

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

    it('finds single json block', () => {
      const message = stripIndent`
      some text
      \`\`\`json
      {
        "foo": "bar"
      }
      \`\`\`
      see how the code block is not not terminated
      `
      const result = getJsonBlock(message)
      la(is.object(result), 'result should be an object', result)
      snapshot(result)
    })

    it('ignores just the text', () => {
      const message = stripIndent`
      some text
      but there is not json block
      `
      const result = getJsonBlock(message)
      la(result === undefined, result)
    })

    it('ignores non-terminated block', () => {
      const message = stripIndent`
      some text
      \`\`\`json
      {
        "foo": "bar"
      }
      see how the code block is not not terminated
      `
      const result = getJsonBlock(message)
      la(result === undefined, result)
    })
  })
})
