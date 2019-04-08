const is = require('check-more-types')
const la = require('lazy-ass')

// to install multiple packages, use comma-separated list
const isNpmInstall = is.schema({
  platform: is.maybe.unemptyString,
  env: is.maybe.object,
  packages: is.unemptyString
})

/**
 * Returns given string surrounded by ```json + ``` quotes
 * @param {string} s
 */
const toJsonCodeBlock = (s) => {
  const start = '```json'
  const finish = '```'

  return `${start}\n${s}\n${finish}\n`
}

/**
 * Converts given JSON object into markdown text block
 * @param {object} object
 */
const toMarkdownJsonBlock = (object) => {
  la(object, 'expected an object to convert to JSON', object)
  const str = JSON.stringify(object, null, 2)

  return toJsonCodeBlock(str)
}

module.exports = {
  isNpmInstall,
  toJsonCodeBlock,
  toMarkdownJsonBlock
}
