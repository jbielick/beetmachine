'use strict'

angular.module('beetmachineApp')
  .controller 'TransportCtrl', [
    '$scope', 'AppLog', '$timeout', 'Transport', ($scope, AppLog, $timeout, Transport) ->
      $scope.transport = Transport
      AppLog.log("Transport Module loaded. Tick = #{$scope.transport.tick}.")
]

