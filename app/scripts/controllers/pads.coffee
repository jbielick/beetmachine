'use strict'

angular.module('beetmachineApp')
  .controller 'PadsCtrl', ['$scope', 'Pads', 'Transport', 'AppLog', ($scope, Pads, Transport, AppLog) ->
    AppLog.log('PadsCtrl loaded.')
    $scope.pads = Pads
    $scope.press = (pad, idx) ->
      pad.sample.play()
      Transport.recordPress(pad, idx)
    $scope.selectGroup = (idx) ->
      return if $scope.currentGroup == idx
      $scope.currentGroup = idx
      $scope.currentPads = Pads.current = Pads.pads[(idx * 16)...(idx * 16 + 16)]
    $scope.selectGroup(0)
]