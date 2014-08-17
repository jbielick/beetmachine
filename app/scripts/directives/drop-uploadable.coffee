'use strict'

angular.module('beetmachine').directive 'dropUploadable', [
  'FileUpload', 'AppLog', 
  (FileUpload, AppLog) ->
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.on 'dragover dragenter', ($event) =>
        $event.preventDefault()
      element.on 'drop', ($event) =>
        $event.preventDefault()
        $event.stopPropagation()
        e = $event.originalEvent
        promise = FileUpload.upload(file: e.dataTransfer.files[0], url: '/sounds')
        scope.$emit 'upload', e, promise
]