'use strict'

describe 'Service: Pattern', () ->

  # load the service's module
  beforeEach module 'beetmachineApp'

  # instantiate service
  Pattern = {}
  beforeEach inject (_Pattern_) ->
    Pattern = _Pattern_

  it 'should do something', () ->
    expect(!!Pattern).toBe true
