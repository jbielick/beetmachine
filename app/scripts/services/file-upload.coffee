'use strict'

angular.module('beetmachine').service 'FileUpload', [
  '$q',
  ($q) ->
    @sendFile = (file, url, deferred) ->
      formData = new FormData()
      formData.append 'sound', file
      @xhr = new XMLHttpRequest()
      @xhr.open 'POST', url, true
      @xhr.upload.onprogress = (e) =>
        if e.lengthComputable
          completed = (e.loaded / e.total) * 100
          deferred.notify(completed)
      @xhr.onerror = (e) =>
        deferred.reject(e)
      @xhr.onload = (e) =>
        try
          data = JSON.parse(e.target.responseText)
          deferred.resolve(data)
        catch e
          msg = "response could't be parsed: #{e.target?.responseText? || e}"
          deferred.reject(msg)
        # @parent.app.display.log("Upload Completed: #{data.filename}")
      @xhr.send(formData)

    @upload = (options) ->
      return false unless options.url? && options.file?
      deferred = $q.defer()
      @sendFile(options.file, options.url, deferred)
      deferred.promise
    @
]