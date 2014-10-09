'use strict'

# more information on audio scheduling and the thoughts behind this strategy
# http://www.html5rocks.com/en/tutorials/audio/scheduling/

angular.module('beetmachine').service 'Transport', [
  'Patterns', 'Pads', '$interval', '$rootScope',
  (Patterns, Pads, $interval, $rootScope) ->
    # responsible for the app's clock and scheulder of audio events
    # 
    # 
    class Transport
      constructor: ->
        @playing = false      # internal flag for playback status
        @recording = false    # internal flag for recording status
        @tick = 0             # where the playhead starts
        @bpm = 100            # beets per minute
        @lookahead = 100      # time (ms) forward the scheduler looks at each interval to schedule audio events
        @patterns = Patterns
        @interval = (60 * 1000) / @bpm / parseInt(@patterns.current.step, 10)

      # plays else stops
      playPause: ->
        if @playing then @_stop() else @_start()

      # sets the playing/recording flags to false
      stop: ->
        @playing = @recording = false

      # move playhead to tick
      goto: (tick, asPercentage) ->
        if asPercentage
          totalTicks = parseInt(@patterns.current.len, 10) * parseInt(@patterns.current.step, 10)
          tick = totalTicks * tick
        $rootScope.$apply () =>
          @tick = tick

      # starts if stopped, toggles recording flag
      record: ->
        if not @playing then @_start()
        @recording = !@recording

      onplay: angular.noop

      onstop: angular.noop

      # gets called each tick interval to 
      _tick: ->
        @tick += 1
        normalizedTick = @getNormalizedTick()
        needles = []
        # @TODO refactor this
        # each time _tick gets called, it should schedule events in the future based on
        # 
        # only need to loop through patterns that are assigned to the current scene
        # of the 
        # 
        #                              _SCENE_
        #                         ,,,/    |   \...
        #                        /        |       \
        #                       |         |        |
        #  loop these ->     pattern -    p   -  pattern   <- each belong to a different group,
        #                      /          |         \          one pattern per group per scene
        #                     |           |         |
        #                    / \         /|\       / \
        #                 sound s       s s s     s sound   <- play these when they have triggers
        #                                                     on the current tick
        # 
        # the triggers coming up that need to be played 
        # angular.forEach @patterns._patterns, (pattern, idx) ->
        #   needle = _.bind (idx, cb) ->
        #     if @vinyl[normalizedTick]
        #       angular.forEach @vinyl[normalizedTick], (trigger, idx) ->
        #         cb null, Pads.pads[idx]?.sample?.play(trigger)
        #   , pattern, idx
        #   needle()
          # needles.push needle
        # async.parallel needles, (err, results) ->

      _start: ->
        @playing = true
        @activeInterval = $interval () =>
          @_tick()
        , @interval

      # private function to stop the clock / scheduler
      _stop: ->
        $interval.cancel @activeInterval
        @playing = false

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
          (100 / totalTicks) * normal / 100
        else
          normal

    new Transport
]