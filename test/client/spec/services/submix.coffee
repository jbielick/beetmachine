'use strict'

describe 'Service: Submix', () ->

  # load the service's module
  beforeEach module 'beetmachine'

  # instantiate service
  Submix = {}
  beforeEach inject (_Submix_) ->
    Submix = _Submix_

  it 'should do something', () ->
    expect(!!Submix).toBe true
