'use strict'

angular.module('beetmachineApp')
  .service 'Patterns', (Pattern) ->
    patterns = {}
    # need to bootstrap data
    patterns['0'] = new Pattern
    {
      patterns: patterns
      current: patterns['0']
      load: (data) ->
        # stubby stub
      select: (idx) ->
        idx = String(idx)
        patterns[idx] = new Pattern unless patterns[idx]
        @current = patterns[idx]
    }