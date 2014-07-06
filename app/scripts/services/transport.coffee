'use strict'

angular.module('beetmachineApp')
  .service 'Transport', ['Patterns', 'Pads', '$interval', (Patterns, Pads, $interval) ->
    patterns = Patterns
    {
      playing: false
      recording: false
      tick: 0
      bpm: 100
      patterns: patterns
      interval: (60 * 1000) / @bpm / parseInt(patterns.current.step, 10)
      playPause: ->
        if @playing then @_stop() else @_start()
      stop: ->
        @playing = @recording = false
      record: ->
        if not @playing then @_start()
        @recording = !@recording
      _tick: ->
        @tick += 1
        normalizedTick = @getNormalizedTick()
        if patterns.current.vinyl[normalizedTick]
          angular.forEach patterns.current.vinyl[normalizedTick], (trigger, idx) ->
            Pads.pads[idx]?.sample?.play(trigger)
      _start: ->
        @playing = true
        @tickInterval = $interval(angular.bind(@, @_tick), @interval)
      _stop: ->
        @playing = false
        $interval.cancel @tickInterval
      restart: ->
        @tick = 0
      recordPress: (pad, idx) ->
        if @recording
          (patterns.current.vinyl[@getNormalizedTick()] ||=  {})[idx] = {velocity: 1, len: 1}
      getNormalizedTick: (asPercentage = false) ->
        totalTicks = parseInt(patterns.current.len, 10) * parseInt(patterns.current.step, 10)
        normal = if @tick <= totalTicks then @tick else @tick % totalTicks
        if asPercentage
          (100 / totalTicks) * normal
        else
          normal
    }
]