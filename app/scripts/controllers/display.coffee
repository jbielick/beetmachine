'use strict'

angular.module('beetmachineApp')
  .controller 'DisplayCtrl', ($scope, $timeout, AppLog) ->
    $scope.tick = 0
    $scope.logs = AppLog.stack
    AppLog.log('Display Module has loaded.')