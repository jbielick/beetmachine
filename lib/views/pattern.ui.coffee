Backbone 							= require('backbone')
Backbone.$ 						= require('jquery')
Backbone.NestedModel 	= require('backbone-nested').NestedModel
Ligament 							= require('backbone-ligaments')
_											= require('underscore')
PatternCollection 		= require('../collections/pattern')
Transport 						= require('./transport')

TRIGGER_CLASS = 'trigger'

class PatternUIView extends Backbone.View

	el: '.pattern'

	initialize: (options = {}) ->
		{ @app } = options

		_.bindAll this, 'updatePlayHead', 'recordTrigger'

		@UIModel = new (Backbone.NestedModel.extend({}))

		@ligament = new Ligament(
			model: @UIModel,
			view: @,
			bindings: {
				'pattern.zoom': {cast: [parseFloat, 10]}
				'pattern.len': {cast: [parseInt, 10]}
				'pattern.step': {cast: [parseInt, 10]}})

		@listenTo @UIModel, 'change:pattern.*', (model, changed) =>
			@app.current.pattern.set(changed)

		@app.transport.on('tick', @updatePlayHead)

		@waitForPads = setInterval () =>
			clearTimeout @waitForPads
			if @app.pads
				@app.pads.on 'press', @recordTrigger
		, 100

	events:
		# 'mousedown .playHead'									: 'engagePlayHeadScrub'
		# 'mouseup .playHead'										: 'disengagePlayHeadScrub'
		'click [data-behavior]'									: 'delegateBehavior'

	delegateBehavior: (e) ->
		behavior = $(e.target).data('behavior')
		if behavior && (delegate = @[behavior])
			meta = $(e.target).data('meta')
			delegate.call(@, e, meta)

	###
	# updates the position of the playhead
	# when transport is in play/record 
	###
	updatePlayHead: (tick) ->
		tick ||= @app.transport.getTick()
		# get normalized 0-100% position, looping after 100% is reached.
		playHeadPosition = @app.current.pattern.view.getNormalizedTick(tick, true)
		@app.current.pattern.view.$playHead.css left: "#{playHeadPosition}%"
		# proxy the tick event to the pattern.grids
		@trigger('tick', tick)
		playHeadPosition


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
	# checks if the transport is recording, records a trigger on 
	# currentPattern in the correct slot.
	###
	recordTrigger: (pad) ->
		if @app.transport._recording
			normalizedTick = @app.current.pattern.view.getNormalizedTick()
			@app.current.pattern.view.addTrigger(pad.number, normalizedTick)

	togglePatternSelectButtons: (patternNumber) ->
		@$('[data-behavior="selectPattern"]')
			.removeClass 'active'
			.filter "[data-meta=\"#{patternNumber}\"]"
			.addClass 'active'

	selectPattern: (e, number) ->
		@_selectPattern(number)

	_selectPatternAt: (idx) ->
		@_selectPattern(@app.current.group.patterns.at(0).get('position'))

	_selectPattern: (patternNumber) ->
		@app.current.group.patterns.findWhere(position: patternNumber) || @app.current.group.patterns.add(position: patternNumber)
		@app.current.pattern = @app.current.group.patterns.findWhere(position: patternNumber)
		@app.current.group.lastActivePattern = @app.current.pattern
		@togglePatternSelectButtons patternNumber
		@$(".grid").hide()
		@app.current.pattern.view.$el.show()
		@UIModel.set('pattern.zoom', @app.current.pattern.get('zoom'))
		# update this current playhead to the correct position
		left = @updatePlayHead()
		# auto scroll to the playhead
		@$('.patterns').prop('scrollLeft', (left / 95) * @app.current.pattern.view.$el.width())
		@trigger('changePattern', @app.current.pattern)

module.exports = PatternUIView