'use strict'

angular.module('beetmachine').directive 'pattern', () ->
  replace: true
  template: '''
    <canvas></canvas>
  '''
  restrict: 'E'
  link: (scope, element, attrs) ->
    w = element.parent().width() * scope.current.zoom * 0.95
    h = 310
    drawGrid = () =>
      element.empty()
      zoom = parseInt(scope.current.zoom, 10) || 2
      w = element.parent().width() * scope.current.zoom * 0.95
      element.width(w)
      element.height(h)
      len = parseInt(scope.current.len, 10)
      step = parseInt(scope.current.step, 10)
      totalTicks = step * len
      xInterval = w / totalTicks
      currentTick = 0
      bar = Math.ceil(totalTicks / len)
      (bars || bars = []).push( i * bar || 0 ) for i in [0..len + 1]
      scope._paper = paper.setup(element[0])
      scope._paper.view.viewSize = new scope._paper.Size(w, h)
      path = new scope._paper.Path()
      while currentTick <= totalTicks
        x = currentTick * xInterval
        path = new scope._paper.Path()
        path.strokeWidth = 1
        path.strokeColor = if currentTick in bars then '#ddd' else '#444'
        path.moveTo(new scope._paper.Point(x - 0.5, 0))
        path.lineTo(new scope._paper.Point(x - 0.5, h))
        currentTick++
      slotHeight = 19
      for i in [0..16]
        x = w
        y = i * slotHeight
        path = new scope._paper.Path()
        path.strokeWidth = 0.2
        path.strokeColor = "#aaa"
        path.moveTo(0, y)
        path.lineTo(x, y)
      scope.playHead = new scope._paper.Path()
      scope.playHead.strokeWidth = 1
      scope.playHead.strokeColor = '#f08a24'
      scope.playHead.moveTo(new scope._paper.Point(0, 0))
      scope.playHead.lineTo(new scope._paper.Point(0, h))
      scope._paper.view.draw()
      # @drawTriggers()
    scope.$watch 'transport.tick', () ->
      if scope._paper
        scope.playHead.removeSegment(0)
        x = scope.transport.getNormalizedTick(true) / 100 * w
        scope.playHead.moveTo(new scope._paper.Point(x, 0))
        scope.playHead.lineTo(new scope._paper.Point(x, h))
        scope._paper.view.draw()
    scope.$watchCollection '[current, current.zoom, current.len, current.step]', () ->
      drawGrid()
