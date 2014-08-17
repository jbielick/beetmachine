'use strict'

describe 'Service: sample', () ->

  # load the service's module
  beforeEach module 'beetmachine'

  # instantiate service
  sample = {}
  beforeEach inject (_sample_) ->
    sample = _sample_

  it 'should do something', () ->
    expect(!!sample).toBe true
