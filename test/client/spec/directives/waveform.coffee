'use strict'

describe 'Directive: waveform', () ->

  # load the directive's module
  beforeEach module 'beetmachineApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<waveform></waveform>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the waveform directive'
