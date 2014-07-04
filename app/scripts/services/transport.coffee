'use strict'

angular.module('beetmachineApp')
  .service 'Transport', ['$interval', ($interval) ->
    {
      playing: false
      recording: false
      tick: 0
      bpm: 100
      step: 64
      interval: (60 * 1000) / @bpm / @step
      playPause: ->
        if @playing then @_stop() else @_start()
      stop: ->
        @playing = @recording = false
      record: ->
        if not @playing then @_start()
        @recording = !@recording
      _tick: ->
        @tick += 1
      _start: ->
        @playing = true
        @tickInterval = $interval angular.bind(@, @_tick), @interval
      _stop: ->
        @playing = false
        $interval.cancel @tickInterval
      restart: ->
        @tick = 0
    }
]