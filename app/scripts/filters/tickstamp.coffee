'use strict'

angular.module('beetmachineApp')
  .filter 'tickstamp', () ->
    (input) ->
      ticks = (''+(input / 1000 * 100)).split('.')[0]
      formatted = ''
      while ticks.length < 8
        ticks = '0'+ticks
      ticks = ticks.split('')
      while true
        formatted += ticks.splice(0, 2).join('')
        if ticks.length >= 2
          formatted += ':'
        break if not ticks.length
      formatted
