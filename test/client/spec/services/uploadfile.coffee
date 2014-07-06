'use strict'

describe 'Service: Uploadfile', () ->

  # load the service's module
  beforeEach module 'beetmachineApp'

  # instantiate service
  Uploadfile = {}
  beforeEach inject (_Uploadfile_) ->
    Uploadfile = _Uploadfile_

  it 'should do something', () ->
    expect(!!Uploadfile).toBe true
