'use strict'

angular.module('beetmachine').factory 'Sample', [
  '$q', 'groove',
  ($q, groove) ->
    class Sample
      constructor: (src) ->
        @load(src) if src?
        @fx = {}
        @

      load: (@src) ->
        _this = @
        deferred = $q.defer()
        @loaded = false
        groove
          .get(@src)
          .then((node) =>
            @node = node
            deferred.resolve @
          ).catch((err) ->
            deferred.reject err
          )
        deferred.promise

      play: () ->
        @node?.play()

    Sample
]