const la = require('lazy-ass')
const is = require('check-more-types')
const os = require('os')
const debug = require('debug')('commit-message-install')
const isNpmInstall = require('./utils').isNpmInstall

// forms JSON object that can be parsed later
function getInstallJson (packages, env, platform, branch, commit) {
  if (!env) {
    env = {}
  }
  if (!platform) {
    platform = os.platform()
  }
  la(
    is.unemptyString(packages) || is.strings(packages),
    'invalid package / list of packages',
    packages
  )
  la(is.object(env), 'invalid env object', env)
  if (is.strings(packages)) {
    packages = packages.join(' ')
  }
  la(is.unemptyString(platform), 'missing platform', platform)

  const json = {
    platform,
    env,
    packages
  }
  if (branch) {
    la(is.unemptyString(branch), 'invalid branch name', branch)
    debug('branch name', branch)
    json.branch = branch
  }
  if (commit) {
    la(
      is.commitId(commit) || is.shortCommitId(commit),
      'invalid commit',
      commit
    )
    json.commit = commit
  }

  la(
    isNpmInstall(json),
    'formed invalid json object',
    json,
    'from arguments',
    arguments
  )
  return json
}

module.exports = getInstallJson