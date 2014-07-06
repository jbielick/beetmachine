'use strict'

describe 'Directive: pattern', () ->

  # load the directive's module
  beforeEach module 'beetmachineApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<pattern></pattern>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the pattern directive'
