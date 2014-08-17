'use strict'

describe 'Service: Patterns', () ->

  # load the service's module
  beforeEach module 'beetmachine'

  # instantiate service
  Patterns = {}
  beforeEach inject (_Patterns_) ->
    Patterns = _Patterns_

  it 'should do something', () ->
    expect(!!Patterns).toBe true
