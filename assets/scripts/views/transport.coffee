define [
	'jquery'
	'underscore'
	'backbone'
	'models/transport'
	'text!/scripts/templates/transport.ejs'
	'views/display'
], ($, _, Backbone, TransportModel, TransportTemplate, Display) ->

	class TransportView extends Backbone.View

		el: '.transport'

		template: _.template TransportTemplate

		initialize: (options) ->
			_.bindAll @, '_start', '_stop', '_tick', 'recalculate'
			@model = new TransportModel(bpm: 100, interval: @calculateInterval(100))
			@_currentTime = 0;
			@_currentTick = 0;
			@_playing = false;
			@_recording = false;
			@render()

			@listenTo(@model, 'change:interval', @recalculate)
			@listenTo(@model, 'change:bpm', @recalculate)

		render: () ->
			@el.innerHTML = @template()

		calculateInterval: (bpm, step = 64) ->
			return (60 * 1000) / 100 / step

		events:
			'click [data-behavior]'			: 'delegateAction'

		delegateAction: (e) ->
			behavior = $(e.currentTarget).data('behavior')
			if this[behavior]
				e.preventDefault()
				this[behavior].call this, e

		stop: (e) ->
			@_stop()
			@$('[data-behavior="record"], [data-behavior="play"]').removeClass 'active'

		play: (e) ->
			if @_playing then @_stop() else @_start()

		record: (e) ->
			if not @_playing then @_start()
			@_recording = !@_recording;
			@$('[data-behavior="record"]').toggleClass('active')

		restart: (e) ->
			@setTime 0
			@setTick 0

		end: (e) ->
			debugger

		_start: () ->
			@_playing = true
			@clock = setInterval(@_tick, @model.get('interval'))
			@$('[data-behavior="play"]').addClass('active')

		_stop: () ->
			clearInterval @clock
			@_playing = false
			@$('[data-behavior="play"], [data-behavior="record"]').removeClass('active')

		_tick: () ->
			@_currentTime += @model.get('interval')
			@_currentTick += 1
			if @pattern && @pattern[@_currentTick] && @pattern[@_currentTick].length > 0
				for pad in @pattern[@_currentTick]
					@pads.pads[pad - 1].play()
			Display.model.set('time', @getTime() / 1000)

		getTick: () ->
			@_currentTick

		getTime: () ->
			@_currentTime

		setTime: (value) ->
			@_currentTime = value
			@_currentTick = value / @model.get('interval')
			Display.model.set('time', @getTime() / 1000)

		setTick: (value) ->
			@_currentTick = value
			@_currentTime = value * @model.get('interval')
			Display.model.set('time', @getTime() / 1000)

		timestamp: () ->

		recalculate: (model, changed) ->
			if changed.bpm
				@model.set('interval', @calculateInterval(changed.bpm))

			@_stop()
			@_start()