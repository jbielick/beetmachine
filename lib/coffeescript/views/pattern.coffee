'use strict';

define [
	'backbone'
	'underscore'
	'collections/pattern'
	'views/transport'
], (Backbone, _, PatternCollection, Transport) -> 

	HAS_TRIGGER_CLASS = 'has-trigger'
	PATTERN_LENGTH 		= 4

	class PatternView extends Backbone.View

		attributes:
			class 			: 'grid'
			style				: 'display:none;'

		initialize: (options = {}) ->
			{ @model, @app, @pads } = options
			@render()

			@app.$('.patterns').append @$el

			_.bindAll this, 'updatePlayHead', 'recordTrigger'

			@app.transport.on('tick', @updatePlayHead)
			@pads.on('press', @recordTrigger)


		events:
			'mousedown .playHead'									: 'engagePlayHeadScrub'
			'mouseup .playHead'										: 'disengagePlayHeadScrub'
			'contextmenu .slot.has-trigger'				: 'UIDeleteTrigger'
			'dblclick .slot'											: 'UIAddTrigger'


		###
		# updates the position of the playhead
		# when transport is in play/record 
		###
		updatePlayHead: (tick) ->
			# get normalized 0-100% position, looping after 100% is reached.
			normalizedTick = tick % @totalTicks
			playHeadPosition = (100 / @totalTicks) * normalizedTick
			@$playHead.css left: "#{playHeadPosition}%"
			if @app.transport._playing && (triggers = @model.get("triggers.#{normalizedTick}")
				_.each triggers, (padNumber) =>
					@model.group.sounds.findWhere(pad: padNumber)?.trigger('press', silent: true)

		###
		#
		#
		###
		engagePlayHeadScrub: (e) ->
			null

		###
		#wefw
		#
		###
		disengagePlayHeadScrub: (e) ->
			null


		###
		# UI delegate.
		# checks if the transport is recording, records a trigger 
		# in a slot 
		###
		recordTrigger: (pad) ->
			# check if currentPads contains the pad that just triggered.
			if @app.transport._recording && pad.model.collection.group.currentPattern is @model
				tick = @app.transport.getTick()
				# normalize the tick in relation to the looping pattern
				normalizedTick = (tick % @totalTicks)
				triggers = @model.get("triggers.#{normalizedTick}") or []
				triggers.push(pad.number)
				# draw trigger on pattern, cache the normalized tick for this trigger
				@tickSlots[normalizedTick][pad.number].addClass( HAS_TRIGGER_CLASS ).data('tick', normalizedTick)
				@model.set("triggers.#{normalizedTick}", triggers)


		###
		# UI delegate.
		# removes the right-clicked trigger from the pattern
		###
		UIDeleteTrigger: (e) ->
			e.preventDefault()
			padNumber = $(e.currentTarget).index()
			@removeTrigger(padNumber, $(e.currentTarget).data('tick'))
			$(e.currentTarget).removeClass(HAS_TRIGGER_CLASS)


		###
		# UI delegate.
		# adds a trigger where the user double-clicks
		###
		UIAddTrigger: (e) ->
			e.preventDefault()
			padNumber = $(e.currentTarget).index()
			debugger
			# @addTrigger(padNumber, )


		draw: () ->
			for own tick, triggers of @model.toJSON()
				@tickSlots[tick][pad].addClass(HAS_TRIGGER_CLASS) for pad in triggers
				# _.each triggers, (pad) => 
				# 	@tickSlots[tick][pad].addClass('has-trigger')

		removeTrigger: (padNumber, normalizedTick) ->
			triggers = @model.get(normalizedTick) || []
			removed = triggers.splice(_.indexOf(triggers, padNumber), 1)
			@model.set("triggers.#{normalizedTick}", triggers)
			removed

		addTrigger: (padNumber, normalizedTick) ->
			(triggers = @model.get("triggers.#{normalizedTick}") || []).push(padNumber)
			@model.set("triggers.#{normalizedTick}", triggers)
			padNumber

		build: () ->
			# lets assume all patterns are 2 bars long and the timesig is 4/4 and the step is 1/64 for the time being
			@length = @model.get('length')
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