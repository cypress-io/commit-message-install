const is = require('check-more-types')

// to install multiple packages, use comma-separated list
const isNpmInstall = is.schema({
  platform: is.maybe.unemptyString,
  env: is.maybe.object,
  packages: is.unemptyString
})

module.exports = {
  isNpmInstall
}
