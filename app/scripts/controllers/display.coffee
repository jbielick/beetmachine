'use strict'

angular.module('beetmachineApp')
  .controller 'DisplayCtrl', [
    '$scope', '$timeout', 'AppLog', 'Transport', ($scope, $timeout, AppLog, Transport) ->
      $scope.transport = Transport
      $scope.logs = AppLog.stack
      AppLog.log('Display Module loaded.')
]