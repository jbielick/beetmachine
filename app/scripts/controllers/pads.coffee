'use strict'

angular.module('beetmachineApp')
  .controller 'PadsCtrl', ['$scope', 'Pads', 'AppLog', ($scope, Pads, AppLog) ->
    AppLog.log('PadsCtrl loaded.')
    $scope.pads = Pads.current
    $scope.press = (idx) =>
      AppLog.log("Pad #{idx} pressed.")
]