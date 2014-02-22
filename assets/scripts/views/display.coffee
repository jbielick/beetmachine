define [
	'jquery'
	'underscore'
	'backbone'
	'models/display'
	'ligaments',
	'text!/scripts/templates/display.ejs'
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

		beforeInject: (model, changed) ->
			if changed.time
				time = (''+(changed.time * 100)).split('.')[0]
				formatted = ''
				while time.length < 8
					time = '0'+time
				time = time.split('')
				while true
					formatted += time.splice(0, 2).join('')
					if time.length >= 2
						formatted += ':'
					break if not time.length
				changed.time = formatted

		render: () ->
			@el.innerHTML = @template(@model.toJSON())