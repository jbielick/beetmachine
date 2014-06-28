Backbone 			= require('backbone')
_							= require('underscore')

class TransportModel extends Backbone.Model

	initialize: (attrs = {}) ->
		if attrs.bpm? and attrs.step
			@setInterval(attrs.bpm, attrs.step)
		@on 'change:interval', @setInterval
		@on 'change:bpm', @setInterval
		@on 'change:step', @setInterval

	# calculates the needed millisecond interval
	# based on the BPM and sequence step
	setInterval: (bpm, step) ->
		interval = ((60 * 1000) / parseInt(bpm or @get('bpm'), 10) / parseInt(step or @get('step'), 10))
		@set('interval', interval)

module.exports = TransportModel