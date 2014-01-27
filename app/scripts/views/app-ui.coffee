define [
	'jquery'
	'underscore'
	'backbone'
	'templates',
	'views/pads-ui',
	'views/display',
	'views/transport'
], ($, _, Backbone, JST, PadsUi, Display, Transport) ->
	class AppUiView extends Backbone.View

		el: 'body'

		template: JST['app/scripts/templates/app.ui.ejs']

		initialize: (config) ->
			@display 			= Display
			@padsUi 			= new PadsUi el: '.pads', config: config
			@transport 		= Transport
			window.display = Display

		events:
			'keydown'			: 'keyController',
			'keyup'				: 'keyController'

		keyController: (e) ->
			pad = @padsUi.collection.findWhere(keyCode: e.keyCode)
			if pad
				if e.type is 'keydown'
					pad.view.press() if pad
				else
					setTimeout () -> 
						pad.view.release() if pad
					, 50
