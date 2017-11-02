# commit-message-install

> NPM install a package by name taken from the last commit message

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save-dev commit-message-install
```

## Use

### Install NPM package from commit message

Imagine you have a CI build that installs NPM dependencies, but you also want to
override one or more dependencies and test by creating a commit. Instead of changing
`package.json` you can make a commit message with embedded JSON block describing
custom installation. Then use this CLI tool to install based on the commit message.

Example CI file command

```
- npm i -g commit-message-install
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
        "packages": "debug,chalk"
    }
    ```

Happy installation
```

**note** `platform` can be `*` or specific one like `darwin` (from Node `os.platform()`) or a 
list of several platforms like `darwin,linux`

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

## API

You can form good Json object to be included in markdown `json` block in the body of
the commit message using provided function

```js
const {getInstallJson} = require('commit-message-install')
// package(s), env, platform
const json = getInstallJson('foo', {foo: 42}, 'linux')
// returns an object
// {platform: "linux", env: {foo: 42}, packages: "foo"}
```

You can pass individual package name like `debug` or several as a single string `debug chalk`
or a list `['debug', 'chalk']`

You can pass for platform either individual `os.platform()` or a "*"" for all, and even
several platforms like `win32,linux` or `linux|darwin`.

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
[open issue](https://github.com/bahmutov/commit-message-install/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

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

[npm-icon]: https://nodei.co/npm/commit-message-install.svg?downloads=true
[npm-url]: https://npmjs.org/package/commit-message-install
[ci-image]: https://travis-ci.org/bahmutov/commit-message-install.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/commit-message-install
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
