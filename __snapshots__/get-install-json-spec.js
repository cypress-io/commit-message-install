exports['getInstallJson sets branch 1'] = {
  "platform": "linux",
  "env": {},
  "packages": "debug chalk",
  "branch": "test-branch"
}

exports['getInstallJson sets commit 1'] = {
  "platform": "linux",
  "env": {},
  "packages": "debug chalk",
  "commit": "b7ccfd8"
}

exports['getInstallJson sets given platform 1'] = {
  "platform": "linux",
  "env": {
    "foo": 42
  },
  "packages": "debug"
}

exports['getInstallJson sets properties and all platforms 1'] = {
  "platform": "*",
  "env": {
    "foo": 42
  },
  "packages": "debug"
}

exports['getInstallJson sets several modules 1'] = {
  "platform": "linux",
  "env": {},
  "packages": "debug chalk"
}

exports['getInstallJson sets status object 1'] = {
  "platform": "linux",
  "env": {},
  "packages": "debug chalk",
  "status": {
    "owner": "foo",
    "repo": "bar",
    "sha": "2d8687c143165218c6b52a76018b76cf99137e48",
    "context": "testing"
  }
}
