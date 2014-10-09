'use strict'

describe 'Directive: fileDrop', () ->

  # load the directive's module
  beforeEach module 'beetmachine'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<file-drop></file-drop>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the fileDrop directive'
