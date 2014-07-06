'use strict'

angular.module('beetmachineApp')
  .controller 'DisplayCtrl', [
    '$scope', '$timeout', 'AppLog', 'Transport', 'Patterns', ($scope, $timeout, AppLog, Transport, Patterns) ->
      $scope.transport = Transport
      $scope.logs = AppLog.stack
      $scope.pattern = Patterns.current
      AppLog.log('Display Module loaded.')
]