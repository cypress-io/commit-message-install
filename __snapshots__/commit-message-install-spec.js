exports['commit-message-install getJsonBlock finds single json block at start 1'] = {
  "foo": "bar"
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

exports['commit-message-install getJsonBlock finds single json block 1'] = {
  "foo": "bar"
}

exports['commit-message-install getJsonBlock returns first found json block 1'] = {
  "foo": "bar"
}

exports['commit-message-install gets last commit message returns just the body of the commit message 1'] = `
message body
`
