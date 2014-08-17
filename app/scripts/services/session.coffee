'use strict'

angular.module('beetmachine').factory 'Session', [
  '$resource',
  ($resource) ->
    $resource '/api/session/'
]