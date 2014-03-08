define [
	'jquery'
	'underscore'
	'backbone'
	'models/display'
	'ligaments',
	'text!/js/templates/display.ejs'
], ($, _, Backbone, DisplayModel, ligaments, DisplayTemplate) ->

	class DisplayView extends Backbone.View

		el: '.display'

		template: _.template(DisplayTemplate)

		initialize: (options) ->
			@parent = options.parent
			@model = new DisplayModel()
			@render()
			@$canvas = this.$('#waveform')
			new Backbone.Ligaments(model: @model, view: @)

		log: (options) ->
			if typeof options is 'string'
				message = options
			else
				message = options.message
			@model.set('one', message)
			@render()

		render: () ->
			@el.innerHTML = @template(@model.toJSON())