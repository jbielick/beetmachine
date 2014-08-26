'use strict'

angular.module('beetmachine').service 'Transport', [
  'Patterns', 'Pads', '$interval',
  (Patterns, Pads, $interval) ->
    class Transport
      constructor: ->
        @playing = false
        @recording = false
        @tick = 0
        @bpm = 100
        @patterns = Patterns
        @interval = (60 * 1000) / @bpm / parseInt(@patterns.current.step, 10)
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
        needles = []
        angular.forEach @patterns._patterns, (pattern, idx) ->
          needle = _.bind (idx, cb) ->
            if @vinyl[normalizedTick]
              angular.forEach @vinyl[normalizedTick], (trigger, idx) ->
                cb null, Pads.pads[idx]?.sample?.play(trigger)
          , pattern, idx
          needles.push needle
        async.parallel needles, (err, results) ->
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
          vinyl = @patterns.current.vinyl[@getNormalizedTick()] ||= {}
          vinyl[idx] = velocity: 1, len: 1
      getNormalizedTick: (asPercentage = false) ->
        totalTicks = parseInt(@patterns.current.len, 10) * parseInt(@patterns.current.step, 10)
        normal = if @tick <= totalTicks then @tick else @tick % totalTicks
        if asPercentage
          (100 / totalTicks) * normal
        else
          normal
    new Transport
]