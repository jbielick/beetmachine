'use strict'

angular.module('beetmachine').directive 'pad', [
  'AppLog', '$modal', 'Sample', 
  (AppLog, $modal, Sample) ->
    restrict: 'E'
    replace: true
    controller: [
      '$scope', 'FileUpload', 'API_URL', ($scope, FileUpload, API_URL) ->
        $scope.upload = {}
        $scope.dynamic = 0
        $scope.type = null
        $scope.pad.sample = $scope.pad.sample || new Sample()
        $scope.openEditor = () ->
          $modal.open {
            templateUrl: 'views/partials/editor.html'
            controller: 'EditorCtrl'
            scope: $scope
          }
        $scope.$on 'filedrop', ($event, e, files) ->
          src = $scope.upload.objectUrl = window.URL.createObjectURL(files[0])
          $scope.pad.sample.load(src)
          FileUpload.upload(file: files[0], url: API_URL + '/sounds')
            .then (data) ->
              console.log(data)
              $scope.upload.data = data
              AppLog.log('File Uploaded')
            , (error) ->
              $scope.type = 'alert'
              $scope.upload.error = error
              AppLog.log('File Upload Failed')
            , (progress) ->
              $scope.upload.progress = progress
    ]
    link: (scope, element, attrs) ->
      element.on 'contextmenu', ($event) ->
        $event.preventDefault()
        scope.openEditor()

    template: '''
      <div class="small-3 columns pad-container">
        <div class="pad-label">
          <small>{{pad.name || 'c' + $index}}</small>
        </div>
        <div file-drop>
          <div class="pad button secondary" ng-class="{mapped:!!pad.sample.src}" ng-click="press(pad, $index)">&nbsp;</div>
          <progressbar ng-show="!pad.sample.src || upload.progress != 0" ng-class="type" max="100" value="upload.progress"></progressbar>
        </div>
      </div>
    '''
]