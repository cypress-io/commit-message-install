exports['commit-message-install getJsonBlock finds single json block 1'] = {
  "foo": "bar"
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

exports['commit-message-install getJsonBlock returns first found json block 1'] = {
  "foo": "bar"
}
