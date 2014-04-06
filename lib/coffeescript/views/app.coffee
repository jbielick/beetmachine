define [
	'jquery'
	'underscore'
	'backbone'
	'deepmodel'
	'ligaments'
	'module'
	'routes/app'
	'views/pads'
	'views/display'
	'views/transport'
	'views/sequence'
	'views/pattern'
	'models/recipe'
], ($, _, Backbone, deepmodel, ligaments, module, Router, Pads, Display, Transport, Sequence, Pattern, RecipeModel) ->

	DEFAULT_KEYS = '6789yuiohjklnm,.'.split('')

	class AppView extends Backbone.View

		el: 'body'

		initialize: () ->
			@recipe 				= new RecipeModel
			@router 				= new Router app: @
			(@display 			= new Display app: @).log('Ready')
			@transport 			= new Transport app: @
			@pads 					= new Pads app: @
			@sequence				= new Sequence app: @
			@UI 						= new Backbone.DeepModel.extend()
			@ligament 			= new Backbone.Ligaments(model: @UI, view: @)
			@keyMap 				= {}

			@keyMap[key.charCodeAt(0)] = i for key, i in DEFAULT_KEYS

			if not _.isEmpty(module.config().recipe)
				@open module.config().recipe, parse: true

		events:
			'click [data-behavior]'			: 'delegateBehavior'
			'keypress'									: 'keyPressDelegate'
			'keydown'										: 'keyDownDelegate'
			'keyup'											: 'keyUpDelegate'

		delegateBehavior: (e) ->
			behavior = $(e.currentTarget).data 'behavior'
			if behavior? and _.isFunction @[behavior]
				@[behavior](e)

		selectGroup: (e) ->
			$target = $(e.currentTarget)
			@pads.render($target.data 'meta')

		open: (@recipe) ->
			# @recipe = recipe
			if recipe.groups.length > 0
				@pads.groups.reset(recipe.groups)
			if recipe.keyMap
				@keyMap = _.extend(@keyMap, recipe.keyMap)

		save: (e) ->
			_this = @
			# @recipe.set('groups', @pads.groups.toJSON())
			console.log(@recipe.toJSON())
			@recipe.save({}, {
				success: (recipe) ->
					_this.pads.groups.each (group) ->
						group
							.save({recipe_id: recipe.id}, {
								success: (groupSaved) ->
									group.patterns.each (pattern) ->
										pattern.save(group_id: groupSaved.id)
									group.sounds.each (sound) ->
										sound.save(group_id: groupSaved.id)
							})
			})

		keyDownDelegate: (e) ->
			key = String.fromCharCode(e.keyCode)

			if key is 'R' and e.ctrlKey
				@transport.record()
				prevent = true
			else if key is ' '
				@transport.play()
				prevent = true
			else if _.indexOf([1, '1', '2', '3', '4', '5', '6', '7', '8'], key) > 0 and e.ctrlKey
				prevent = true
				@pads.render key

			e.preventDefault() if prevent

		keyPressDelegate: (e) ->
			if @keyMap[e.charCode]?
				@pressing = e.charCode
				pad = @pads.currentPads[@keyMap[e.charCode]]?.trigger('press')

		keyUpDelegate: (e) ->
			pad = @pads.currentPads[@keyMap[e.charCode]]?.trigger('release') if e.charCode is @pressing

	new AppView()