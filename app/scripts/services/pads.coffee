'use strict'

angular.module('beetmachineApp')
  .service 'Pads', () ->
    @pads = []
    i = 0
    while i < 128
      @pads.push({name: "c#{i + 1}"}) 
      i++
    {
      pads: @pads
      current: @pads[0..15]
    }

