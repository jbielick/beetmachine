define [
	'jquery'
	'underscore'
	'backbone'
	'views/pad'
	'collections/group'
	'collections/sound'
	'views/display'
	'text!/scripts/templates/pads.ejs'
	'views/transport'
], ($, _, Backbone, PadView, GroupCollection, SoundCollection, Display, PadsTemplate, Transport) ->

	class PadsView extends Backbone.View

		el: '.pads'

		template: _.template PadsTemplate

		initialize: (options) ->
			@parent = options.parent
			Display.log('Ready')
			@collection = new SoundCollection()
			@createPads()
			@render()
			Display.log('Samples Loaded')

			@listenTo(@collection, 'reset', (collection) =>
				@createPads()
				@render()
			)

		createPads: (config) ->
			@pads = []
			i = 1
			while i <= 16
				options = 
					model: @collection.findWhere(pad: i) || @collection.add(pad: i).findWhere(pad: i)
					name: 'c'+i
					parent: @

				pad = new PadView options
				@pads.push pad
				i++

		record: (pad) ->
			if Transport._recording
				tick = Transport.getTick()
				Transport.pattern or (Transport.pattern = {})
				Transport.pattern[tick] or (Transport.pattern[tick] = [])
				Transport.pattern[tick].push(pad.model.get('pad'))

		render: () ->
			@$el.empty()
			@$el.append(_.pluck(@pads, 'el'))