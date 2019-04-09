'use strict'

/* eslint-env mocha */
const la = require('lazy-ass')
const is = require('check-more-types')
const snapshot = require('snap-shot-it')

describe('getInstallJson', () => {
  const getInstallJson = require('.').getInstallJson

  it('is a function', () => {
    la(is.fn(getInstallJson))
  })

  it('sets properties and all platforms', () => {
    const json = { packages: 'debug', env: { foo: 42 }, platform: '*' }
    snapshot(getInstallJson(json))
  })

  it('sets given platform', () => {
    const json = {
      packages: 'debug',
      env: { foo: 42 },
      platform: 'linux'
    }
    snapshot(getInstallJson(json))
  })

  it('sets several modules', () => {
    const json = {
      packages: ['debug', 'chalk'],
      env: {},
      platform: 'linux'
    }
    snapshot(getInstallJson(json))
  })

  it('sets branch', () => {
    const json = {
      packages: ['debug', 'chalk'],
      env: {},
      platform: 'linux',
      branch: 'test-branch'
    }
    snapshot(getInstallJson(json))
  })

  it('sets commit', () => {
    const json = {
      packages: ['debug', 'chalk'],
      env: {},
      platform: 'linux',
      branch: null,
      commit: 'b7ccfd8'
    }
    snapshot(getInstallJson(json))
  })

  it('sets status object', () => {
    const status = {
      owner: 'foo',
      repo: 'bar',
      sha: '2d8687c143165218c6b52a76018b76cf99137e48'
    }
    const json = {
      packages: ['debug', 'chalk'],
      env: {},
      platform: 'linux',
      status
    }
    snapshot(getInstallJson(json))
  })
})
