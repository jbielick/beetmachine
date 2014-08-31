'use strict'

describe 'Directive: dropUploadable', () ->

  # load the directive's module
  beforeEach module 'beetmachine'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<drop-uploadable></drop-uploadable>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the dropUploadable directive'