'use strict'

describe 'Service: Mixer', () ->

  # load the service's module
  beforeEach module 'beetmachine'

  # instantiate service
  Mixer = {}
  beforeEach inject (_Mixer_) ->
    Mixer = _Mixer_

  it 'should do something', () ->
    expect(!!Mixer).toBe true
