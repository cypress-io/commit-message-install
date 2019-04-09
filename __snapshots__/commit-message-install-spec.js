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

exports['commit-message-install getCommand returns original command from array 1'] = {
  "args": [
    "echo",
    "foo",
    "bar"
  ],
  "command": "echo foo bar"
}

exports['commit-message-install getJsonBlock finds single json block 1'] = {
  "foo": "bar"
}

exports['commit-message-install getJsonBlock finds single json block at start 1'] = {
  "foo": "bar"
}

exports['commit-message-install getJsonBlock returns first found json block 1'] = {
  "foo": "bar"
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

exports['commit-message-install gets last commit message returns just the body of the commit message 1'] = `
message body
`

exports['commit-message-install isArchAllowed compares arch isArchAllowed 1'] = {
  "name": "isArchAllowed",
  "behavior": [
    {
      "given": [
        "x64",
        "x64"
      ],
      "expect": true
    },
    {
      "given": [
        null,
        "x64"
      ],
      "expect": true
    },
    {
      "given": [
        "*",
        "x64"
      ],
      "expect": true
    },
    {
      "given": [
        null,
        null
      ],
      "expect": true
    },
    {
      "given": [
        "ia32,x64",
        "ia32"
      ],
      "expect": true
    },
    {
      "given": [
        "ia32,x64",
        "x64"
      ],
      "expect": true
    },
    {
      "given": [
        "ia32,x64",
        null
      ],
      "expect": true
    },
    {
      "given": [
        "ia32",
        "x64"
      ],
      "expect": false
    },
    {
      "given": [
        "x64",
        "ia32"
      ],
      "expect": false
    }
  ]
}

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

exports['formed json object'] = {
  "platform": "linux",
  "arch": "x64",
  "env": {},
  "packages": "debug chalk",
  "status": {
    "owner": "foo",
    "repo": "bar",
    "sha": "2d8687c143165218c6b52a76018b76cf99137e48"
  }
}

exports['parsed back message'] = {
  "platform": "linux",
  "arch": "x64",
  "env": {},
  "packages": "debug chalk",
  "status": {
    "owner": "foo",
    "repo": "bar",
    "sha": "2d8687c143165218c6b52a76018b76cf99137e48"
  }
}
