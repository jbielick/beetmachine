'use strict'

angular.module('beetmachine')
  .controller 'SequenceCtrl', ($scope, $http) ->
    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings