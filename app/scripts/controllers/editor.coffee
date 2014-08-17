'use strict'

angular.module('beetmachine')
  .controller 'EditorCtrl', ($scope) ->
    $scope.cache = {}
    $scope.toggleFx = (fxName) ->
      if $scope.pad.sample.fx[fxName]?
        $scope.cache[fxName] = angular.copy($scope.pad.sample.fx[fxName])
        delete $scope.pad.sample.fx[fxName]
      else
        $scope.pad.sample.fx[fxName] = $scope.cache[fxName] || {}
    $scope.$watch 'pad.sample.fx', () ->
      # $scope.pad.sample.rendered = false