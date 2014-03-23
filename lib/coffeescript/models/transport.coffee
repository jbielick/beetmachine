'use strict'

define [
	'jquery',
	'underscore'
	'backbone'
], ($, _, Backbone) ->

	class TransportModel extends Backbone.Model

		initialize: (attrs = {}) ->
			if attrs.bpm? && attrs.step
				@setInterval(attrs.bpm, attrs.step)
			@on 'change:interval', @setInterval
			@on 'change:bpm', @setInterval
			@on 'change:step', @setInterval

		# calculates the needed millisecond interval
		# based on the BPM and sequence step
		setInterval: (bpm, step) ->
			@set('interval', ((60 * 1000) / parseInt(bpm || @get('bpm'), 10) / parseInt(step || @get('step'), 10))