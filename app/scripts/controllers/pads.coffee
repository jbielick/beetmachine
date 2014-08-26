'use strict'

angular.module('beetmachine').controller 'PadsCtrl', [
  '$scope', 'Pads', 'Transport', 'AppLog', 'Mixer',
  ($scope, Pads, Transport, AppLog, Mixer) ->
    AppLog.log('PadsCtrl loaded.')
    $scope.pads = Pads
    $scope.groups = Mixer.groups
    $scope.press = (pad, idx) ->
      pad.sample.play()
      Transport.recordPress(pad, idx)
    $scope.selectGroup = (idx) ->
      return if $scope.currentGroup == idx
      $scope.currentGroup = idx
      $scope.currentPads = Pads.current = Pads.pads[(idx * 16)...(idx * 16 + 16)]
    $scope.selectGroup(0)
]