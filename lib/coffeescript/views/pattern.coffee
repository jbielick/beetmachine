'use strict';

define [
	'backbone'
	'underscore'
	'collections/pattern'
	'views/transport'
], (Backbone, _, PatternCollection, Transport) -> 

	class PatternView extends Backbone.View

		attributes:
			'class' 		: 'grid'
			style				: 'display:none;'

		initialize: (options = {}) ->
			@model = options.model
			@app = options.app
			@pads = options.pads
			@render()
			@app.$('.patterns').append(@$el)
			_.bindAll this, 'updatePlayHead', 'recordTrigger'
			@app.transport.on 'tick', @updatePlayHead
			@pads.on 'press', @recordTrigger

		events:
			'mousedown .playHead'			: 'engagePlayHeadScrub'
			'mouseup .playHead'				: 'disengagePlayHeadScrub'
			'contextmenu .slot'				: 'unmark'

		updatePlayHead: (tick) ->
			# get normalized 0-100% position, looping after 100% is reached.
			normalizedTick = tick % @totalTicks
			playHeadPosition = (100 / @totalTicks) * normalizedTick
			@$playHead.css left: playHeadPosition + '%'
			if @app.transport._playing && (triggers = @model.get(normalizedTick.toString()))
				_.each triggers, (padNumber) =>
					@model.group.sounds.findWhere(pad: padNumber)?.trigger('press', silent: true)

		recordTrigger: (pad) ->
			#check if currentPads
			if @app.transport._recording && pad.model.collection.group.currentPattern is @model
				tick = @app.transport.getTick()
				normalizedTick = (tick % @totalTicks).toString()
				triggers = @model.get(normalizedTick) || []
				if _.indexOf(triggers, pad.number) < 0
					triggers.push(pad.number)
					@tickSlots[normalizedTick][pad.number].addClass('has-trigger')
					@model.set(normalizedTick, triggers)

		unmark: (e) ->
			e.preventDefault()
			debugger

		draw: () ->
			_.each @model.toJSON(), (tick, triggers) =>
				_.each triggers, (pad) => 
					@tickSlots[tick][pad].addClass('has-trigger')

		build: () ->
			# lets assume all patterns are 2 bars long and the timesig is 4/4 and the step is 1/64 for the time being
			@length = 4
			@bar = @app.transport.model.get('step')
			@totalTicks = @bar * @length
			@tickSlots = {}
			width = 100 / @totalTicks
			tick = 0
			cols = []
			while tick < @totalTicks
				slot = 0
				@tickSlots[tick] = []
				cols[tick] = $('<div class="col" style="width:' + width + '%;">')
				if tick % @bar is 0
					cols[tick].css('border-left', '1px solid #777')
				slots = []
				while slot < 16
					$slot = $('<div class="slot">&nbsp;</div>')
					slots.push($slot)
					@tickSlots[tick][slot] = $slot
					slot++
				cols[tick].append(slots)
				tick++
			@$el.append(cols)
			@$el.append (@$playHead = $('<div class="playHead">'))
			@draw()

		render: () ->
			@$el.empty()
			@build()