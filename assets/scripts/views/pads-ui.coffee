define [
	'jquery'
	'underscore'
	'backbone'
	'views/pad',
	'collections/sound'
	'views/display'
	'text!/scripts/templates/pads-ui.ejs'
], ($, _, Backbone, PadView, SoundCollection, Display, PadsUiTemplate) ->
	class PadsUiView extends Backbone.View
		template: _.template PadsUiTemplate
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