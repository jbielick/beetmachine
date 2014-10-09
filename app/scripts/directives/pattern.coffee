'use strict'

angular.module('beetmachine').directive 'pattern', ['Transport', (Transport) ->
  replace: true
  template: '''
    <div style="position:relative;">
      <canvas id="pattern" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:0;"></canvas>
      <canvas id="playHead" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:1;"></canvas>
    </div>
  '''
  restrict: 'E'
  controller: ['$scope', 'Transport', ($scope, Transport) ->
    $scope.Transport = Transport
  ]
  link: (scope, element, attrs) ->
    patternCanvas = element[0].querySelector('#pattern')
    playHeadCanvas = element[0].querySelector('#playHead')
    pattern = patternCanvas.getContext('2d')
    playHead = playHeadCanvas.getContext('2d')
    zoom = w = h = len = step = totalTicks = currentTick = bar = xInterval = playHeadX = 0

    computedStyles = window.getComputedStyle(element[0]) # computed styles for the current element
    paddingLeft = parseFloat(computedStyles.paddingLeft, 10) # left computed padding
    paddingRight = parseFloat(computedStyles.paddingRight, 10) # right computed padding
    availableWidth = element[0].clientWidth - (paddingRight + paddingLeft) # possible width to consume

    devicePixelRatio = window.devicePixelRatio || 1
    backingStoreRatio = pattern.webkitBackingStorePixelRatio ||
      pattern.mozBackingStorePixelRatio ||
      pattern.msBackingStorePixelRatio ||
      pattern.oBackingStorePixelRatio ||
      pattern.backingStorePixelRatio || 1
    renderRatio = devicePixelRatio / backingStoreRatio

    recalculate = () =>
      zoom = 2
      w = element.parent().width() * scope.current.zoom * 0.95
      h = 310
      len = parseInt(scope.current.len, 10)
      step = parseInt(scope.current.step, 10)
      totalTicks = step * len
      currentTick = 0
      xInterval = w / totalTicks
      bar = Math.ceil totalTicks / len
      patternCanvas.height = playHeadCanvas.height = h * renderRatio
      patternCanvas.width = playHeadCanvas.width = w * renderRatio
      patternCanvas.style.height = playHeadCanvas.style.height = "#{h}px"
      patternCanvas.style.width = playHeadCanvas.style.width = "#{w}px"
      pattern.scale(renderRatio, renderRatio)
      playHead.scale(renderRatio, renderRatio)

    drawGrid = () =>
      recalculate()
      bars = []
      bars.push( i * bar || 0 ) for i in [0..len + 1]
      # scope._paper.view.viewSize = new scope._paper.Size w, h
      # path = new scope._paper.Path()
      path = pattern.beginPath()
      while currentTick <= totalTicks
        x = currentTick * xInterval
        pattern.save()
        pattern.beginPath()
        pattern.lineWidth = 1
        pattern.strokeStyle = if currentTick in bars then '#ddd' else '#444'
        pattern.moveTo(x - 0.5, 0)
        pattern.lineTo(x - 0.5, h)
        pattern.stroke()
        pattern.restore()
        currentTick++
      slotHeight = 19
      for i in [0..16]
        x = w
        y = i * slotHeight
        pattern.save()
        pattern.beginPath()
        pattern.lineWidth = 0.2
        pattern.strokeStyle = "#aaa"
        pattern.moveTo(0, y)
        pattern.lineTo(x, y)
        pattern.stroke()
        pattern.restore()
      # @drawTriggers()
    
    drawPlayHead = () =>
      x = scope.transport.getNormalizedTick(true) * w
      playHead.clearRect(0, 0, w, h)
      playHead.beginPath()
      playHead.lineWidth = 1
      playHead.strokeStyle = '#f08a24'
      playHead.moveTo(x, 0)
      playHead.lineTo(x, h)
      playHead.stroke()
      requestAnimationFrame () ->
        drawPlayHead()

    drawGrid()
    drawPlayHead()

    onDoubleClick = (e) ->

    onDragStart = (e) ->
      element.on 'dragend', onDragEnd

    onMouseMove = (e) ->
      

    onDragEnd = (e) ->
      element.off 'drag', onMouseMove

    element.on 'dblclick', (e) ->
      pos = e.offsetX / e.target.clientWidth
      Transport.goto(pos, true)

    element.on 'dragstart', (e) ->
      pos = e.offsetX / e.target.clientWidth
      Transport.goto(pos, true)
    
    # scope.$watch 'transport.tick', updatePlayHead()
    scope.$watch () ->
      JSON.stringify scope.current
    , () ->
      requestAnimationFrame drawGrid

]