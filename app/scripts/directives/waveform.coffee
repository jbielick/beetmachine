'use strict'

angular.module('beetmachine').directive 'waveform', () ->
  replace: true
  template: '''
    <canvas 
      class="waveform" 
      alt="Click to preview" 
      ng-click="pad.sample.play()">
        No Pad or Not Rendered Yet
    </canvas>
    '''
  restrict: 'EA'
  link: (scope, element, attrs) ->
    renderOptions = {
      width: attrs.width || element.parent().width()
      height: attrs.height || 100
      target: element[0]
      lineWidth: attrs.lineWidth || 0.5
      background: attrs.background || '#222'
      foreground: attrs.foreground || '#f08a24'
    }
    element.height(renderOptions.height).attr('height', renderOptions.height)
    element.width(renderOptions.width).attr('width', renderOptions.width)
    if scope.pad.sample.T?.rendered?
      scope.pad.sample.T.rendered.plot(renderOptions)
    else if scope.pad.sample.T?.raw?
      scope.pad.sample.T.raw.plot(renderOptions)
    element.on 'click', (e) ->