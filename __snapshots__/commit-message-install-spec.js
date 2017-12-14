exports['commit-message-install getInstallJson sets properties and all platforms 1'] = {
  "platform": "*",
  "env": {
    "foo": 42
  },
  "packages": "debug"
}

exports['commit-message-install getInstallJson sets given platform 1'] = {
  "platform": "linux",
  "env": {
    "foo": 42
  },
  "packages": "debug"
}

exports['commit-message-install getInstallJson sets several modules 1'] = {
  "platform": "linux",
  "env": {},
  "packages": "debug chalk"
}

exports['commit-message-install gets last commit message returns just the body of the commit message 1'] = `
message body
`

exports['commit-message-install isPlatformAllowed compares platforms isPlatformAllowed 1'] = {
  "name": "isPlatformAllowed",
  "behavior": [
    {
      "given": [
        "win32",
        "win32"
      ],
      "expect": true
    },
    {
      "given": [
        "win32",
        "linux"
      ],
      "expect": false
    },
    {
      "given": [
        "*",
        "linux"
      ],
      "expect": true
    },
    {
      "given": [
        "win32,linux",
        "linux"
      ],
      "expect": true
    },
    {
      "given": [
        "win32|linux",
        "linux"
      ],
      "expect": true
    },
    {
      "given": [
        "win32, linux",
        "linux"
      ],
      "expect": true
    }
  ]
}

exports['commit-message-install getCommand returns original command from array 1'] = {
  "args": [
    "echo",
    "foo",
    "bar"
  ],
  "command": "echo foo bar"
}

exports['commit-message-install getCommand removes -f and its argument 1'] = {
  "args": [
    "-f",
    "file.txt",
    "echo",
    "foo",
    "bar"
  ],
  "command": "echo foo bar"
}

exports['commit-message-install getCommand removes --file and its argument 1'] = {
  "args": [
    "--file",
    "file.txt",
    "echo",
    "foo",
    "bar"
  ],
  "command": "echo foo bar"
}

exports['commit-message-install getJsonBlock finds single json block at start 1'] = {
  "foo": "bar"
}

exports['commit-message-install getJsonBlock finds single json block 1'] = {
  "foo": "bar"
}

exports['commit-message-install getJsonBlock returns first found json block 1'] = {
  "foo": "bar"
}

exports['commit-message-install getInstallJson sets branch 1'] = {
  "platform": "linux",
  "env": {},
  "packages": "debug chalk",
  "branch": "test-branch"
}

exports['commit-message-install getJsonBlock returns json with branch 1'] = {
  "foo": "bar",
  "branch": "test-branch"
}

exports['commit-message-install getJsonFromGit extracts the json from git message 1'] = {
  "platform": "win32",
  "branch": "some-branch"
}

exports['commit-message-install gets commit message for specific commit returns just the body of specific commit 1'] = `
message body
`
