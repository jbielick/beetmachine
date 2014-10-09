'use strict'

angular.module('beetmachine').controller 'PadsCtrl', [
  '$scope', 'Pads', 'Transport', 'AppLog', 'mixer',
  ($scope, Pads, Transport, AppLog, mixer) ->
    AppLog.log('PadsCtrl loaded.')
    $scope.pads = Pads
    $scope.groups = mixer.groups
    $scope.press = (pad, idx) ->
      pad.sample.play()
      Transport.recordPress(pad, idx)
    $scope.selectGroup = (idx) ->
      return if $scope.currentGroup == idx
      $scope.currentGroup = idx
      $scope.currentPads = Pads.current = Pads.pads[(idx * 16)...(idx * 16 + 16)]
    $scope.selectGroup(0)
]