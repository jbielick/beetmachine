'use strict'

angular.module('beetmachine')
  .controller 'TransportCtrl', [
    '$scope', 'AppLog', '$timeout', 'Transport', ($scope, AppLog, $timeout, Transport) ->
      $scope.transport = Transport
]

