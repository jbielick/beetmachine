'use strict'

angular.module('beetmachineApp')
  .controller 'PatternCtrl', ['$scope', 'Pads', 'Transport', 'Patterns', ($scope, Pads, Transport, Patterns) ->
    $scope.pads = Pads
    $scope.transport = Transport
    $scope.patterns = Patterns
    $scope.current = Patterns.current
]