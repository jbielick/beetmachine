'use strict'

angular.module('beetmachineApp')
  .controller 'PatternCtrl', ['$scope', '$http', 'Pads', ($scope, $http, Pads) ->
    $scope.pads = Pads.current
]