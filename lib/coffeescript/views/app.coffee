define [
	'jquery'
	'underscore'
	'backbone'
	'deepmodel'
	'ligaments'
	'module'
	'async'
	'routes/app'
	'views/pads'
	'views/display'
	'views/transport'
	'views/sequence'
	'views/pattern'
	'models/recipe'
], ($, _, Backbone, deepmodel, ligaments, module, async, Router, Pads, Display, Transport, Sequence, Pattern, RecipeModel) ->

	DEFAULT_KEYS 		= '6789yuiohjklnm,.'.split('')
	RECORD_CHAR			= 'R'
	PLAYPAUSE_CHAR 	= ' '
	APP_EL_SELECTOR = 'body'

	class AppView extends Backbone.View

		el: APP_EL_SELECTOR

		initialize: () ->
			@recipe 				= new RecipeModel
			@router 				= new Router app: @
			(@display 			= new Display app: @).log('Ready')
			@transport 			= new Transport app: @
			@pads 					= new Pads app: @
			@sequence				= new Sequence app: @
			@UIModel				= new (Backbone.DeepModel.extend())
			@ligament 			= new Backbone.Ligaments(
				model: @UIModel, 
				view: @, 
				bindings: {
					'pattern.zoom': {cast: [parseFloat, 10]}})
			@keyMap 				= {}

			@listenForUIEvents()

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

		listenForUIEvents: () ->
			@listenTo @UIModel, 'change:pattern.zoom', (model, value) ->
				@pads.currentGroup.currentPattern.view.el.style.width = "#{value * 100}%"

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
			async.waterfall [
				(recipeSavedCallback) =>
					@recipe.save({}, {
						success: (savedRecipe) =>
							async.each @pads.groups.models, (group, eachGroupSavedCallback) ->
								group.save({recipe_id: savedRecipe.id}, {
									success: (savedGroup) =>
										async.parallel [
											(cbSound) ->
												async.each group.sounds.models, (sound, eachSoundSavedCallback) ->
													sound.save({group_id: group.id}, {
														success: (savedSound) ->
															eachSoundSavedCallback(null, savedSound)
														error: (err) ->
															eachSoundSavedCallback(err)
													})
												, (err) ->
													cbSound(err) if err
													cbSound(null)
											, (cbPattern) ->
												async.each group.patterns.models, (pattern, eachPatternSavedCallback) ->
													pattern.save({group_id: group.id}, {
														success: (savedPattern) ->
															eachPatternSavedCallback(null, savedPattern)
														error: (err) ->
															eachPatternSavedCallback(err)
													})
												, (err) ->
													cbPattern(err) if err
													cbPattern(null)
										], (err) ->
											eachGroupSavedCallback(err) if err
											eachGroupSavedCallback(null)
								})
							, (err) ->
								recipeSavedCallback(null)
						error: (err) ->
							recipeSavedCallback(err)
					})
			], (err, recipe) ->
				throw new Error(err) if err 
				console.log('SUCCESS')

		toJSON: (e) ->
			recipe = @recipe.toJSON()
			recipe.groups = []
			@pads.groups.each (group) =>
				groupAttributes = group.toJSON()
				groupAttributes.sounds = []
				group.sounds.each (sound) =>
					groupAttributes.sounds.push(sound.toJSON())
				groupAttributes.patterns = []
				group.patterns.each (pattern) =>
					groupAttributes.patterns.push(pattern.toJSON())
				recipe.groups.push(groupAttributes)
			console.log(recipe)

		keyDownDelegate: (e) ->
			char = String.fromCharCode(e.keyCode)

			if char is RECORD_CHAR and e.ctrlKey
				@transport.record()
				prevent = true
			else if char is PLAYPAUSE_CHAR
				@transport.play()
				prevent = true
			else if _.indexOf([1, '1', '2', '3', '4', '5', '6', '7', '8'], char) > 0 and e.ctrlKey
				prevent = true
				@pads.render char

			e.preventDefault() if prevent

		keyPressDelegate: (e) ->
			if @keyMap[e.charCode]?
				@pressing = e.charCode
				pad = @pads.currentPads[@keyMap[e.charCode]]?.trigger('press')

		keyUpDelegate: (e) ->
			pad = @pads.currentPads[@keyMap[e.charCode]]?.trigger('release') if e.charCode is @pressing

	new AppView()