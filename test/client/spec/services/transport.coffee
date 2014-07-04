'use strict'

describe 'Service: transport', () ->

  # load the service's module
  beforeEach module 'beetmachineApp'

  # instantiate service
  transport = {}
  beforeEach inject (_transport_) ->
    transport = _transport_

  it 'should do something', () ->
    expect(!!transport).toBe true
