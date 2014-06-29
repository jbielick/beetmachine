'use strict'

angular.module('beetmachineApp')
  .controller 'DisplayCtrl', ($scope, $timeout) ->
    $scope.tick = 0
    $scope.messages = ['Welcome']

    $timeout () ->
      $scope.messages.push('The app has started')
    , 1000, true