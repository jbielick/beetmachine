'use strict'

angular.module('beetmachineApp')
  .factory 'Session', ($resource) ->
    $resource '/api/session/'
