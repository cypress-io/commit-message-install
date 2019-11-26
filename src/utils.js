const is = require('check-more-types')
const la = require('lazy-ass')
const execa = require('execa')

// to install multiple packages, use comma-separated list
const isNpmInstall = is.schema({
  platform: is.maybe.unemptyString,
  arch: is.maybe.unemptyString,
  env: is.maybe.object,
  packages: is.unemptyString
})

/**
 * Returns given string surrounded by ```json + ``` quotes
 * @param {string} s
 */
const toJsonCodeBlock = s => {
  const start = '```json'
  const finish = '```'

  return `${start}\n${s}\n${finish}\n`
}

/**
 * Converts given JSON object into markdown text block
 * @param {object} object
 */
const toMarkdownJsonBlock = object => {
  la(object, 'expected an object to convert to JSON', object)
  const str = JSON.stringify(object, null, 2)

  return toJsonCodeBlock(str)
}

/**
 * Little utility function to make stubbing "execa" easier.
 * @param {string} cmd Command to run
 * @param {readonly string[]} args List of arguments
 * @param {object} options Child process options
 */
const callExeca = (cmd, args, options) => {
  la(is.unemptyString(cmd), 'missing command to execute', cmd)
  la(is.strings(args), 'arguments should be a list of string', args)
  la(is.object(options), 'options should be an object', options)
  return execa(cmd, args, options)
}

module.exports = {
  isNpmInstall,
  toJsonCodeBlock,
  toMarkdownJsonBlock,
  callExeca
}
