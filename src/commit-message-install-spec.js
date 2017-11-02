'use strict'

/* eslint-env mocha */
const { getMessage, getJsonBlock } = require('.')
const la = require('lazy-ass')
const is = require('check-more-types')
const { stripIndent } = require('common-tags')
const snapshot = require('snap-shot-it')

describe('commit-message-install', () => {
  context('gets last commit message', () => {
    it('returns just the body of the commit message', () => {
      return getMessage().then(x => {
        la(is.maybe.unemptyString(x), 'invalid message format', x)
      })
    })
  })

  context('isPlatformAllowed', () => {
    const { isPlatformAllowed } = require('.')

    it('is a function', () => {
      la(is.fn(isPlatformAllowed))
    })

    it('compares platforms', () => {
      snapshot(
        isPlatformAllowed,
        ['win32', 'win32'],
        ['win32', 'linux'],
        ['*', 'linux'],
        ['win32,linux', 'linux'],
        ['win32|linux', 'linux'],
        ['win32, linux', 'linux']
      )
    })
  })

  context('getCommand', () => {
    const { getCommand } = require('.')

    it('is a function', () => {
      la(is.fn(getCommand))
    })

    it('returns original command from array', () => {
      const args = ['echo', 'foo', 'bar']
      const command = getCommand(args)
      snapshot({ args, command })
    })

    it('removes -f and its argument', () => {
      const args = ['-f', 'file.txt', 'echo', 'foo', 'bar']
      const command = getCommand(args)
      snapshot({ args, command })
    })

    it('removes --file and its argument', () => {
      const args = ['--file', 'file.txt', 'echo', 'foo', 'bar']
      const command = getCommand(args)
      snapshot({ args, command })
    })
  })

  context('getJsonBlock', () => {
    it('is a function', () => {
      la(is.fn(getJsonBlock))
    })

    it('finds single json block at start', () => {
      const message = stripIndent`
      \`\`\`json
      {
        "foo": "bar"
      }
      \`\`\`
      and some test after that
      `
      const result = getJsonBlock(message)
      la(is.object(result), 'result should be an object', result)
      snapshot(result)
    })

    it('finds single json block', () => {
      const message = stripIndent`
      some text
      \`\`\`json
      {
        "foo": "bar"
      }
      \`\`\`
      some text after it
      `
      const result = getJsonBlock(message)
      la(is.object(result), 'result should be an object', result)
      snapshot(result)
    })

    it('returns first found json block', () => {
      const message = stripIndent`
      some text
      \`\`\`json
      {
        "foo": "bar"
      }
      \`\`\`
      then second block
      \`\`\`json
      {
        "no": false
      }
      \`\`\`
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
