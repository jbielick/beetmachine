'use strict'

angular.module('beetmachine').factory 'AppLog', () ->
  {
    stack: []
    log: (message, level) ->
      @stack.push(message: message, level: level, at: +new Date())
  }