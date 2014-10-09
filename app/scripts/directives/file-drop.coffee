'use strict'

angular.module('beetmachine').directive 'fileDrop', [
  'AppLog',
  (AppLog) ->
    restrict: 'EA'
    link: (scope, element, attrs) ->
      element.on 'dragover dragenter', ($event) =>
        $event.preventDefault()
      element.on 'drop', ($event) =>
        $event.preventDefault()
        $event.stopPropagation()
        e = $event.originalEvent
        scope.$emit 'filedrop', e, e.dataTransfer.files
]