'use strict'

angular.module('beetmachineApp')
  .factory 'AppLog', () ->
    {
      stack: []
      log: (message, level) ->
        this.stack.push(message: message, level: level, at: +new Date())
    }