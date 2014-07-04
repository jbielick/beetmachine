'use strict'

describe 'Service: Pads', () ->

  # load the service's module
  beforeEach module 'beetmachineApp'

  # instantiate service
  Pads = {}
  beforeEach inject (_Pads_) ->
    Pads = _Pads_

  it 'should do something', () ->
    expect(!!Pads).toBe true
