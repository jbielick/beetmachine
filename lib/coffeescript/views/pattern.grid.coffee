'use strict';

define [
	'backbone'
	'underscore'
	'collections/pattern'
	'ligaments'
	'paper'
], (Backbone, _, PatternCollection, ligaments, Paper) -> 

	HAS_TRIGGER_CLASS = 'has-trigger'
	PATTERN_LENGTH 		= '4'

	class PatternGridView extends Backbone.View

		attributes:
			class 			: 'grid'
			style				: 'display:none;'

		initialize: (options = {}) ->
			{ @model } = options

			_.bindAll @, 'drawGrid', 'addTrigger', 'removeTrigger', 'onTick'

			# the reference to App should be through parents / hierarchy of the schema. It's otherwise
			# very difficult to instantiate / manage the reference to app as models / collections are created / reset
			# elsewhere 
			@app = @model.collection.group.app
			@ui = @app.pattern

			# append this grid to the patterns view
			@ui.$('.patterns').append @$el

			@model.set('len', PATTERN_LENGTH) unless @model.get('len')

			@render()

			# redrawGrid the grid when the pattern changes
			@listenTo @model, 'change:len', @drawGrid
			@listenTo @model, 'change:zoom', @drawGrid
			@listenTo @model, 'change:step', @drawGrid
			@listenTo @model, 'remove', @remove

			@listenTo @ui, 'tick', @onTick

		events:
			'contextmenu .trigger'								: 'clickDeleteTrigger'
			'dblclick'														: 'clickAddTrigger'

		###
		# UI delegate.
		# adds a trigger where the user double-clicks
		###
		clickAddTrigger: (e) ->
			e.preventDefault()
			@addTrigger(@offsetToPadNumber(e.offsetY), @offsetToTick(e.offsetX))

		###
		# UI delegate.
		# removes the right-clicked trigger from the pattern
		###
		clickDeleteTrigger: (e) ->
			e.preventDefault()
			data = $(e.target).data()
			@removeTrigger(data.padNumber, data.tick)
			$(e.target).remove()

		onTick: (tick) ->
			normalizedTick = @getNormalizedTick(tick)
			if @app.transport._playing && (triggers = @model.get("triggers.#{normalizedTick}"))
				_.each triggers, (padNumber) =>
					@model.collection.group.sounds.findWhere(pad: padNumber)?.trigger('press', silent: true)

		drawTriggers: () ->
			for own tick, triggers of @model.get('triggers')
				for padNumber in triggers
					@drawTrigger padNumber, tick
				
		drawTrigger: (padNumber, tick) ->
			totalTicks = @getTotalTicks()
			left = (100 / @getTotalTicks()) * @getNormalizedTick(tick)
			$trigger = $('<div class="trigger">')
										.css
											top: (padNumber - 1) * @ui.$('.slot').eq(0).outerHeight() + "px"
											height: "#{@ui.$('.slot').eq(0).outerHeight()}px"
											width: "#{(@w / totalTicks) / @w * 100}%"
											left: "#{left}%"
										.data 'tick', tick
										.data 'padNumber', padNumber
			@$el.append($trigger)

		removeTrigger: (padNumber, normalizedTick) ->
			if (triggers = @model.get("triggers.#{normalizedTick}"))
				@app.current.pattern.view.drawTrigger(normalizedTick, padNumber)
				removed = triggers.splice(_.indexOf(triggers, padNumber), 1)
				@model.set("triggers.#{normalizedTick}", triggers)
				removed
			else 
				false

		addTrigger: (padNumber, normalizedTick) ->
			triggers = @model.get("triggers.#{normalizedTick}") || []
			unless triggers.indexOf(padNumber) > -1
				triggers.push(padNumber)
				@app.current.pattern.view.drawTrigger(padNumber, normalizedTick)
				@model.set("triggers.#{normalizedTick}", triggers)
			padNumber

		getTotalTicks: () ->
			totalTicks = (@model.get('len') * @app.transport.model.get('step'))

		getNormalizedTick: (tick, asPercentage = false) ->
			tick ||= @app.transport.getTick()
			totalTicks = @getTotalTicks()
			if tick <= totalTicks
				normal = tick
			else
				normal = tick % @getTotalTicks()
			if asPercentage
				return (100 / totalTicks) * normal
			else
				return normal

		offsetToPadNumber: (offset, isPercentage = false) ->
			unless isPercentage
				offset = offset / @$el.outerHeight()
			padNumber = Math.ceil(offset * 16)

		offsetToTick: (offset, isPercentage = false) ->
			unless isPercentage
				offset = offset / @w
			tick = Math.floor(@getTotalTicks() * offset)

		tickToOffset: () ->
			# 

		drawGrid: () ->
			zoom = @model.get('zoom') || 2
			$patternWindow = @ui.$('.patterns')
			w = @w = $patternWindow.width() * @model.get('zoom')
			h = 310
			@$el.width(w)
			@$el.height(h)
			len = parseInt(@model.get('len'), 10)
			step = parseInt(@app.transport.model.get('step'), 10)
			totalTicks = step * len
			xInterval = w / totalTicks
			currentTick = 0
			bar = Math.floor(w / len)
			(bars || bars = []).push( i * bar || 0 ) for i in [0..len + 1]
			@paper = paper.setup @$canvas.get(0)
			@paper.view.viewSize = new @paper.Size(w, h)
			path = new @paper.Path()
			while currentTick <= totalTicks
				x = currentTick * xInterval
				path = new @paper.Path()
				path.strokeWidth = 0.5
				path.strokeColor = if Math.floor(x) in bars || Math.ceil(x) in bars then '#ddd' else '#444'
				path.moveTo(new @paper.Point(x, 0))
				path.lineTo(new @paper.Point(x, h))
				currentTick++
			slotHeight = @ui.$('.slot').eq(0).outerHeight()
			for i in [0..16]
				x = w
				y = i * slotHeight
				path = new @paper.Path()
				path.strokeWidth = 0.2
				path.strokeColor = "#aaa"
				path.moveTo(0, y)
				path.lineTo(x, y)
			@paper.view.draw()
			@$el.find('.trigger').remove()
			@drawTriggers()

		render: () ->
			@$el.empty()
			# create the canvas to draw on
			@$canvas = $('<canvas>').appendTo @$el
			@$playHead = $('<div class="playHead">').appendTo @$el
			@drawGrid()