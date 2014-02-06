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
			@collection = new SoundCollection(options.project.groups[1].sounds)
			@createPads()
			@render()
			Display.log('Ready')
			Display.log('Samples Loaded')
		createPads: (config) ->
			@pads = []
			i = 1
			while i <= 16
				options = model: @collection.findWhere(pad: i) || @collection.add(pad: i)
				options.name = 'c'+i
				pad = new PadView options
				@pads.push pad
				i++
		render: () ->
			els = []
			for view in @pads
				els.push(view.el)
			@$el.append(els)