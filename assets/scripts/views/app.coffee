define [
	'jquery'
	'underscore'
	'backbone'
	'module'
	'routes/app'
	'views/pads',
	'views/display',
	'views/transport'
], ($, _, Backbone, module, Router, Pads, Display, Transport) ->

	class AppUiView extends Backbone.View

		el: 'body'

		initialize: () ->
			@router 				= new AppRouter
			@display 				= new Display parent: @
			@pads 					= new Pads parent: @
			@transport 			= new Transport parent: @

			if not _.isEmpty(module.config().recipe)
				@open(module.config().recipe)

		events:
			'keydown'			: 'keyControllerDown'
			'keyup'				: 'keyControllerUp'

		open: (recipe) ->
			@recipe = recipe
			if recipe.groups.length > 0
				@padsUi.collection.reset(recipe.groups[0].sounds)

		keyControllerDown: (e) ->
			pad = @padsUi.collection.findWhere(keyCode: e.keyCode)
			pad.view.press() if pad
			if String.fromCharCode(e.keyCode) is 'R' && e.ctrlKey
				Transport.record()
			else if String.fromCharCode(e.keyCode) is ' '
				Transport.play()

		keyControllerUp: (e) ->
			pad = @padsUi.collection.findWhere(keyCode: e.keyCode)
			pad.view.release() if pad


	return new AppUiView()