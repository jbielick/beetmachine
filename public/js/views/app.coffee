define [
	'jquery'
	'underscore'
	'backbone'
	'module'
	'routes/app'
	'views/pads'
	'views/display'
	'views/transport'
	'views/sequence'
	'views/pattern'
	'models/recipe'
], ($, _, Backbone, module, Router, Pads, Display, Transport, Sequence, Pattern, RecipeModel) ->

	class AppView extends Backbone.View

		el: 'body'

		initialize: () ->
			@router 				= new Router app: @
			@display 				= new Display parent: @
			@pads 					= new Pads parent: @
			@pattern				= new Pattern parent: @
			@sequence				= new Sequence parent: @
			@transport 			= new Transport parent: @

			@recipe = new RecipeModel

			@keyMap = {}

			defaultKeys = '6789yuiohjklnm,.'

			_.each(defaultKeys, (key, i) =>
				@keyMap[key.charCodeAt(0)] = i
			)

			@display.log('Ready')

			if not _.isEmpty(module.config().recipe)
				@open(module.config().recipe, parse: true)

		events:
			'click [data-behavior]'			: 'delegateBehavior'
			'keypress'									: 'keyPressDelegate'
			'keydown'										: 'keyDownDelegate'

		delegateBehavior: (e) ->
			behavior = $(e.currentTarget).data 'behavior'
			if behavior? and _.isFunction @[behavior]
				@[behavior](e)

		selectGroup: (e) ->
			$target = $(e.currentTarget)
			@pads.render($target.data 'meta')

		open: (recipe) ->
			@recipe = recipe
			if recipe.groups.length > 0
				@pads.groups.reset(recipe.groups)
			if recipe.keyMap
				@keyMap = _.extend(@keyMap, recipe.keyMap)

		save: (e) ->
			@recipe.set('groups', @pads.groups.toJSON())
			console.log(@recipe.toJSON())

		keyDownDelegate: (e) ->
			key = String.fromCharCode(e.keyCode)

			if key is 'R' and e.ctrlKey
				@transport.record()
			else if key is ' '
				@transport.play()
			else if _.indexOf([1, '1', '2', '3', '4', '5', '6', '7', '8'], key) > 0 and e.ctrlKey
				e.preventDefault()
				@pads.render(key)

		keyPressDelegate: (e) ->
			@pads.currentPads[@keyMap[e.charCode]].press() if @keyMap[e.charCode]?


	return new AppView()