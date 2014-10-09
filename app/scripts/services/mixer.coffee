'use strict'

angular.module('beetmachine').service 'mixer', [
  'groove',
  (groove) ->
    class Mixer
      constructor: ->
        @groups = []
        @groups[i + 1] = groove.createBus() for i in [0...8]
    new Mixer
]
