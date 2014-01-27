define [
	'jquery'
	'underscore'
	'backbone'
	'templates'
	'views/pad',
	'collections/sound'
	'views/display'
], ($, _, Backbone, JST, PadView, SoundCollection, Display) ->
	class PadsUiView extends Backbone.View
		template: JST['app/scripts/templates/pads.ui.ejs']
		initialize: (options) ->
			@collection = new SoundCollection(options.config.sounds)
			@createPads()
			@render()
			Display.log('Ready')
			Display.log('Samples Loaded')
		createPads: (config) ->
			@pads = []
			i = 0
			while i < 16
				x = i - (Math.floor(i/4) * 4)
				y = Math.floor(i/4)
				model = @collection.findWhere x: x, y: y
				if model
					options = model: model
				else
					options = x: x, y: y
				options.name = 'c'+i
				pad = new PadView options
				@pads.push pad
				@collection.add()
				i++
		render: () ->
			els = []
			for view in @pads
				els.push(view.el)
			@$el.append(els)