Backbone 					= require('backbone')
Backbone.$ 				= require('jquery')
Ligament 					= require('backbone-ligaments')
_									= require('underscore')
DisplayModel 			= require('../models/display')
displayTemplate 	= require('../templates/display.tpl')

class DisplayView extends Backbone.View

	el: '.display'

	template: displayTemplate

	initialize: (options) ->
		{ @app } = options
		@model = new DisplayModel()
		@render()
		@$canvas = this.$('#waveform')
		new Ligament(model: @model, view: @)

	log: (options) ->
		if typeof options is 'string'
			message = options
		else
			message = options.message
		@model.set('one', message)
		@render()

	render: () ->
		@el.innerHTML = @template(@model.toJSON())

module.exports = DisplayView