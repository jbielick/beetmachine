'use strict'

describe 'Service: FileUpload', () ->

  # load the service's module
  beforeEach module 'beetmachine'

  # instantiate service
  FileUpload = {}
  beforeEach inject (_FileUpload_) ->
    FileUpload = _FileUpload_

  it 'should do something', () ->
    expect(!!FileUpload).toBe true
