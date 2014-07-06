'use strict'

angular.module('beetmachineApp')
  .controller 'SequenceCtrl', ($scope, $http) ->
    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings