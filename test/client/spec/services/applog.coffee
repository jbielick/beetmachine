'use strict'

describe 'Service: AppLog', () ->

  # load the service's module
  beforeEach module 'beetmachine'

  # instantiate service
  AppLog = {}
  beforeEach inject (_AppLog_) ->
    AppLog = _AppLog_

  it 'should do something', () ->
    expect(!!AppLog).toBe true
