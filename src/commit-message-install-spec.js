'use strict'

/* eslint-env mocha */
const getMessage = require('.').getMessage
const getJsonBlock = require('.').getJsonBlock
const getJsonFromGit = require('.').getJsonFromGit
const getInstallJson = require('./get-install-json')
const toMarkdownJsonBlock = require('./utils').toMarkdownJsonBlock

const la = require('lazy-ass')
const is = require('check-more-types')
const {stripIndent} = require('common-tags')
const snapshot = require('snap-shot-it')
const stubSpawnShellOnce = require('stub-spawn-once').stubSpawnShellOnce

describe('commit-message-install', () => {
  const getMessageGitCommand = 'git show -s --pretty=%b'

  context('gets last commit message', () => {
    beforeEach(() => {
      stubSpawnShellOnce(getMessageGitCommand, 0, 'message body', '')
    })

    it('returns just the body of the commit message', () => {
      return getMessage().then(x => {
        la(is.unemptyString(x), 'invalid message format', x)
        snapshot(x)
      })
    })
  })

  context('gets commit message for specific commit', () => {
    const sha = '3d243ea'
    beforeEach(() => {
      const cmd = getMessageGitCommand + ' ' + sha
      stubSpawnShellOnce(cmd, 0, 'message body', '')
    })

    it('returns just the body of specific commit', () => {
      return getMessage(sha).then(x => {
        la(is.unemptyString(x), 'invalid message format', x)
        snapshot(x)
      })
    })
  })

  context('getJsonFromGit', () => {
    it('is a function', () => {
      la(is.fn(getJsonFromGit))
    })

    it('extracts the json from git message', () => {
      const message = `
        below is test json block

        \`\`\`json
        {
          "platform": "win32",
          "branch": "some-branch"
        }
        \`\`\`
      `
      stubSpawnShellOnce(getMessageGitCommand, 0, message, '')
      return getJsonFromGit().then(snapshot)
    })

    it('extracts formed json correctly', () => {
      const status = {
        owner: 'foo',
        repo: 'bar',
        sha: '2d8687c143165218c6b52a76018b76cf99137e48'
      }
      const info = getInstallJson(['debug', 'chalk'], {}, 'linux', null, null, status)
      const json = toMarkdownJsonBlock(info)
      const message = `some text\n\n` + json

      stubSpawnShellOnce(getMessageGitCommand, 0, message, '')
      return getJsonFromGit().then(json => {
        snapshot(json)
      })
    })

    it('returns undefined without valid block', () => {
      const message = 'this message has no json code'
      stubSpawnShellOnce(getMessageGitCommand, 0, message, '')

      return getJsonFromGit().then(json => {
        la(json === undefined, 'found json', json)
      })
    })
  })

  context('--else branch', () => {
    const commitMessageInstall = require('../bin/commit-message-install')

    beforeEach(() => {
      stubSpawnShellOnce('git show -s --pretty=%b', 0, 'nothing to do', '')
      stubSpawnShellOnce('echo cool', 0, 'cool is working', '')
    })

    it('executes --else command', () => {
      return commitMessageInstall(['--else', 'echo cool']).then(x => {
        la(x.stdout === 'cool is working')
      })
    })
  })

  context('isPlatformAllowed', () => {
    const isPlatformAllowed = require('.').isPlatformAllowed

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
    const getCommand = require('.').getCommand

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

    it('returns json with branch', () => {
      const message = stripIndent`
      some text
      \`\`\`json
      {
        "foo": "bar",
        "branch": "test-branch"
      }
      \`\`\`
      then some other text
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
