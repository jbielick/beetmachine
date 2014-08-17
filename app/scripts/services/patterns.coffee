'use strict'

angular.module('beetmachine').service 'Patterns', [
  'Pattern',
  (Pattern) ->
    patterns = {}
    # need to bootstrap data
    patterns['0'] = new Pattern
    {
      _patterns: patterns
      current: patterns['0']
      load: (data) ->
        # stubby stub
      select: (idx) ->
        idx = String(idx)
        patterns[idx] = new Pattern unless patterns[idx]
        @current = patterns[idx]
    }
]