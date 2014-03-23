define [
	'jquery'
	'underscore'
	'backbone'
	'models/transport'
	'text!/js/templates/transport.ejs'
], ($, _, Backbone, TransportModel, TransportTemplate) ->

	class TransportView extends Backbone.View

		el: '.transport'

		template: _.template TransportTemplate

		initialize: (options) ->
			@app = options.parent
			_.bindAll @, '_start', '_stop', '_tick', 'recalculate'
			@model = new TransportModel bpm: 100, interval: @calculateInterval(100)
			@_currentTime = 0
			@_currentTick = 0
			@_playing = false
			@_recording = false
			@render()

			@listenTo @model, 'change:interval', @recalculate
			@listenTo @model, 'change:bpm', @recalculate

		render: ->
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
			@_recording = !@_recording
			@$('[data-behavior="record"]').toggleClass 'active'

		restart: (e) ->
			@setTime 0
			@setTick 0

		end: (e) ->
			debugger

		_start: ->
			@_playing = true
			@clock = setInterval @_tick, parseInt(@model.get('interval'), 10)
			@$('[data-behavior="play"]').addClass 'active'

		_stop: ->
			clearInterval @clock
			@_recording = false
			@_playing = false
			@$('[data-behavior="play"], [data-behavior="record"]').removeClass 'active'

		_tick: ->
			@_currentTime += @model.get 'interval'
			@_currentTick++
			if @pattern && @pattern[@_currentTick] && @pattern[@_currentTick].length > 0
				for pad in @pattern[@_currentTick]
					@app.pads.currentGroup.sounds.findWhere(pad: pad)?.trigger 'press'
			@app.display.model.set 'left', @getTime(true)

		getTick: ->
			@_currentTick

		getTime: (readable = false) ->
			if not readable 
				@_currentTime
			else
				time = (''+(@_currentTime / 1000 * 100)).split('.')[0]
				formatted = ''
				while time.length < 8
					time = '0'+time
				time = time.split('')
				while true
					formatted += time.splice(0, 2).join('')
					if time.length >= 2
						formatted += ':'
					break if not time.length
				return formatted

		setTime: (value) ->
			@_currentTime = value
			@_currentTick = value / @model.get 'interval'
			@app.display.model.set('left', @getTime() / 1000)

		setTick: (value) ->
			@_currentTick = value
			@_currentTime = value * @model.get 'interval'
			@app.display.model.set 'left', (@getTime() / 1000)

		timestamp: ->

		recalculate: (model, changed) ->
			if changed.bpm
				@model.set 'interval', @calculateInterval(changed.bpm)

			@_stop()
			@_start()

