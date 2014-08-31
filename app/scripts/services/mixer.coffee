'use strict'

angular.module('beetmachine').service 'Mixer', [
  'Submix',
  (Submix) ->
    class Mixer
      constructor: ->
        @groups = []
        @groups[i + 1] = new Submix(@) for i in [0...8]
    new Mixer
]
