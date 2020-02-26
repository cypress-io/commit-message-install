# @cypress/commit-message-install

> NPM install a package by name taken from the last commit message

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]
[![renovate-app badge][renovate-badge]][renovate-app]

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save-dev @cypress/commit-message-install
yarn add -D @cypress/commit-message-install
```

or globally

```sh
npm i -g @cypress/commit-message-install
yarn global @cypress/commit-message-install
```

### Node version

We are trying to use the same minimum version of Node as Cypress

## Use

### Install NPM package from commit message

Imagine you have a CI build that installs NPM dependencies, but you also want to
override one or more dependencies and test by creating a commit. Instead of changing
`package.json` you can make a commit message with embedded JSON block describing
custom installation. Then use this CLI tool to install based on the commit message.

Example CI file command

```
- npm i -g @cypress/commit-message-install
- commit-message-install
```

If commit message is this

```
this will install package debug and chalk and while
installing them will set environment variable FOO to "bar".
The install will happen on all platforms

    ```json
    {
        "platform": "*",
        "architecture": "x64",
        "packages": "debug,chalk"
    }
    ```

Happy installation
```

**note** `platform` can be `*` or specific one like `darwin` (from Node `os.platform()`) or a list of several platforms like `darwin,linux`. `architecture` is usually 64 bit `x64` as returned by `os.arch()`.

### Specific commit

You can install using commit message from a specific commit (not the current one)

```shell
$ $(npm bin)/commit-message-install --sha f81a00
```

### Alternative command

You can specify a command to run *if commit message has no JSON block*. For example you can
install default dependency

```bash
$ $(npm bin)/commit-message-install --else "npm install foo-bar"
```

### Run or skip command based on platform

If the commit message allows a specific platform, you can run any command, while
setting environment variables from the commit message. For example if th
commit message embeds the following JSON block

```json
{
    "platform": "win32",
    "env": {
        "FOO": "bar"
    }
}
```

and the CI has command `run-if echo Foo is \\$FOO`, then on Windows CI it will print
`Foo is bar` and on other platforms it will skip this step.

In general, if you use `commit-message-install` on the CI, then you should use `run-if` command as well!
For example, here are CircleCI steps that install default dependencies, but then run
conditional steps

```
steps:
  - checkout
  - run: npm install
  - run: $(npm bin)/commit-message-install
  - run: $(npm bin)/run-if $(npm bin)/cypress version
  - run: DEBUG=cypress:cli $(npm bin)/run-if $(npm bin)/cypress verify
```

### Set GitHub commit status

Very useful to notify other projects asynchronously via GitHub commit states.

```text
$(npm bin)/set-status --label "context label" --state success --description "short message"
```

State can be "error", "pending", "failure" or "success". `--label` is optional, if not set, then the platform and the package name will be used.

### Has commit message

You can use script `has-message` to check if the last or a specific commit has JSON commit information block

```text
$(npm bin)/has-message
$(npm bin)/has-message --sha f81a00
```

If there is a message in the commit's body the script will exit with code 0. Otherwise it will exit with code 1.

See [commit-message-install-example](https://github.com/bahmutov/commit-message-install-example) repo for an example. Here is CircleCI halting if there is no commit message JSON

```yml
# install tool locally
- run: npm install @cypress/commit-message-install
- run: |
    if ! $(npm bin)/has-message; then
        echo Stopping early, no commit message
        circleci-agent step halt
    else
        echo All good, found commit message JSON
    fi
```

```yml
# install tool globally using Yarn
- run: yarn global @cypress/commit-message-install
- run: |
    if ! has-message; then
        echo Stopping early, no commit message
        circleci-agent step halt
    else
        echo All good, found commit message JSON
    fi
```

## API

### getJsonFromGit

Extracts JSON block from the current Git message text

```js
const {getJsonFromGit} = require('@cypress/commit-message-install')
getJsonFromGit()
    .then(json => {
        // {platform: 'win32', packages: 'foo', branch: 'test-branch'}
    })
```

If there is no valid JSON object in the message, resolves with `undefined`.

### getInstallJson

You can form good Json object to be included in markdown `json` block in the body of
the commit message using provided function

```js
const {getInstallJson} = require('@cypress/commit-message-install')
// package(s), env, platform, branch name (optional)
const json = getInstallJson('foo',
    {foo: 42}, 'linux', 'test-branch', 'b7ccfd8')
// returns an object
    // {
    //   platform: "linux",
    //   env: {foo: 42},
    //   packages: "foo",
    //   branch: "test-branch",
    //   commit: "b7ccfd8"
    // }
```

You can pass individual package name like `debug` or several as a single string
`debug chalk` or a list `['debug', 'chalk']`

You can pass for platform either individual `os.platform()` or a "*"" for all, and even
several platforms like `win32,linux` or `linux|darwin`.

### npmInstall

After getting JSON from a commit message you can install dependencies

```js
const {getInstallJson, npmInstall} = require('@cypress/commit-message-install')
getInstallJson()
  .then(npmInstall)
```

## Debugging

- Run this tool with `DEBUG=commit-message-install` environment variable set
- Force reading commit message from a local file with `--file <filename>` option

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/cypress-io/commit-message-install/issues) on Github

## MIT License

Copyright (c) 2017 Cypress.io

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/@cypress/commit-message-install.svg?downloads=true
[npm-url]: https://npmjs.org/package/@cypress/commit-message-install
[ci-image]: https://travis-ci.org/cypress-io/commit-message-install.svg?branch=master
[ci-url]: https://travis-ci.org/cypress-io/commit-message-install
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
