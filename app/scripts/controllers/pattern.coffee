'use strict'

angular.module('beetmachine').controller 'PatternCtrl', [
  '$scope', 'Pads', 'Transport', 'Patterns',
  ($scope, Pads, Transport, Patterns) ->
    $scope.pads = Pads
    $scope.transport = Transport
    $scope.patterns = Patterns
    $scope.current = Patterns.current
]