'use strict'

angular.module('beetmachineApp')
  .directive('pad', () ->
    template: '''
      <div class="small-3 columns pad-container">
        <div class="pad-label">
          <small>{{pad.name}}</small>
        </div>
        <div class="pad button secondary" ng-class="{mapped:pad.src}" ng-click="press($index)">&nbsp;</div>
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    '''
    restrict: 'E'
    scope: {
      pad: '='
    }
    link: (scope, element, attrs, controller) ->
      sendFile = (file) ->
        formData = new FormData()
        xhr = new XMLHttpRequest()
        xhr.open 'POST', '/sounds', true
        formData.append 'sound', file
        xhr.upload.onprogress = (e) =>
          if e.lengthComputable
            completed = (e.loaded / e.total) * 100
            # @$('.progress-bar').css(width: "#{completed.toFixed(0)}%")
        xhr.onerror = (e) =>
          # @parent.app.display.log("Upload failed")
        xhr.onload = (e) =>
          console.log(e)
          try
            data = JSON.parse(e.target.responseText)
          catch e
            alert("response could't be parsed: #{e.target.responseText}")
          # @model.set(data)
          # @parent.app.display.log("Upload Completed: #{data.filename}")
          cb && cb(@model, data)
          try
            
          catch e
            # @parent.app.display.log("Upload failed")
            alert("An error occurred #{e.message} with response #{e.responseText}")

        xhr.send(formData)

      upload = (e) ->
        objectUrl = window.URL?.createObjectURL?(e.dataTransfer?.files?[0])
        scope.$apply ->
          scope.pad.src = objectUrl
          scope.pad.name = 'new pad'
        file = e.dataTransfer.files[0]
        # sendFile(file)

        # @model.set('src', objectUrl)
        # @parent.app.display.log("File: #{e.dataTransfer.files[0].name} set on pad #{@name}")
        # @parent.app.display.log("Uploading: #{e.dataTransfer.files[0].name}")

      element.on 'dragover dragenter', ($event) =>
        $event.preventDefault()
      element.on 'drop', ($event) =>
        e = $event.originalEvent
        $event.preventDefault()
        $event.stopPropagation()
        upload(e)
  )
