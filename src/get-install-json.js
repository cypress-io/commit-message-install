const la = require('lazy-ass')
const is = require('check-more-types')
const os = require('os')
const debug = require('debug')('commit-message-install')
const isNpmInstall = require('./utils').isNpmInstall

const isStatus = is.schema({
  owner: is.unemptyString,
  repo: is.unemptyString,
  sha: is.commitId
})

// forms JSON object that can be parsed later
function getInstallJson ({
  packages,
  env,
  platform,
  arch,
  branch,
  commit,
  status
} = {}) {
  if (!env) {
    env = {}
  }
  if (!platform) {
    platform = os.platform()
  }
  if (!arch) {
    arch = os.arch()
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
    arch,
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

  if (status) {
    la(isStatus(status), 'invalid status object', status)
    json.status = status
  }

  la(
    isNpmInstall(json),
    'formed invalid json object',
    json,
    'from arguments',
    arguments
  )

  debug('formed install json object %o', json)

  return json
}

module.exports = getInstallJson
