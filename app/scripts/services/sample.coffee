'use strict'

angular.module('beetmachineApp')
  .factory 'sample', ['$q', ($q) ->

    Sample = (src) ->
      @load(src) if src?
      @fx = {}
      @

    Sample::load = (src) ->
      _this = @
      deferred = $q.defer()
      if @src || (@src = src)
        @loaded = false
        T('audio').load @src, ->
          _this.T = raw: this
          _this.loaded = true
          deferred.resolve()
        deferred.promise
      else
        false

    Sample::renderEffects = () ->
      sound = null
      delete @T.rendered if @T
      @T.rendered = @T.raw.clone()

      angular.forEach @fx, (params, fxName) =>
        sound = T(fxName, params, sound || @T.rendered)

      @rendered = true
      @T.rendered = sound || @T.rendered

    Sample::play = () ->
      return false unless @loaded
      if not @rendered
        @renderEffects()
        if not @timbreContextAttached
          @timbreContextAttached = true
          $(@T.rendered.play()).one 'ended', () -> @pause()
        else
          @T.rendered.bang()
      else
        if @T.rendered?.playbackState
          @T.rendered.currentTime = 0
        else
          $(@T.rendered.bang()).one 'ended', -> @pause()
      @

    Sample
]