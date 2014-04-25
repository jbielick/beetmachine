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
	'views/pattern.ui'
	'models/recipe'
	'collections/group'
], ($, _, Backbone, deepmodel, ligaments, module, async, Router, Pads, Display, Transport, Sequence, PatternUIView, RecipeModel, GroupCollection) ->

	DEFAULT_KEYCODES = [
		54, 55, 56,  57
		89, 85, 73,  79
		72, 74, 75,  76
		78, 77, 188, 190
	]
	RECORD_CHAR			= 82
	PLAYPAUSE_CHAR 	= 32
	APP_EL_SELECTOR = 'body'

	class AppView extends Backbone.View

		el: APP_EL_SELECTOR

		initialize: () ->
			window.App = @
			@current 					= {}
			@recipe 					= new RecipeModel(module.config().recipe)
			@router 					= new Router app: @
			(@display 				= new Display app: @).log('Please Wait...')
			@transport 				= new Transport app: @
			@pattern 					= new PatternUIView app: @
			@groups 					= new GroupCollection({position: 1}, app: @)
			@pads 						= new Pads app: @
			@sequence					= new Sequence app: @
			@UIModel					= new (Backbone.DeepModel.extend())
			@keyMap 				= {}

			async.series [
				(callback) =>
					if @recipe.get('id')
						@open @recipe, () =>
							callback(null, true)
					else
						callback(null, false)
			], (err, opened) =>
				@_selectGroupAt(0)
				@pattern._selectPatternAt(0)

			@keyMap[keyCode] = i for keyCode, i in DEFAULT_KEYCODES

			@display.log 'Ready'

		events:
			'click [data-behavior]'			: 'delegateBehavior'
			'keypress'									: 'keyPressDelegate'
			'keydown'										: 'keyDownDelegate'
			'keyup'											: 'keyUpDelegate'

		delegateBehavior: (e) ->
			behavior = $(e.currentTarget).data 'behavior'
			meta = $(e.currentTarget).data 'meta'
			if behavior? and _.isFunction @[behavior]
				@[behavior].call(@, e, meta)

		selectGroup: (e, number) ->
			@_selectGroup(number)

		_selectGroupAt: (idx) ->
			@_selectGroup(@groups.at(0).get('position'))

		_selectGroup: (groupNumber) ->
			@current.group = @groups.findWhere(position: groupNumber)
			@pads.render(groupNumber)

		open: (recipe, callback) ->
			_this = this
			@display.log("Loading #{@recipe.get('name')}...");
			@groups.fetchRecursive @, @recipe, (err, fetched) =>
				# @pads.bootstrapGroupPads(@groups.at(0))
				callback.call(@)
				@display.log "Recipe \"#{@recipe.get('name')}\" Loaded"

		save: (e) ->
			_this = @
			async.waterfall [
				(recipeSavedCallback) =>
					@recipe.save({}, {
						success: (savedRecipe) =>
							async.each @groups.models, (group, eachGroupSavedCallback) ->
								group.save({recipe_id: savedRecipe.id}, {
									success: (savedGroup) =>
										async.parallel [
											(cbSample) ->
												async.each group.samples.models, (sample, eachSampleSavedCallback) ->
													sample.save({groupId: group.id}, {
														success: (savedSample) ->
															eachSampleSavedCallback(null, savedSample)
														error: (err) ->
															eachSampleSavedCallback(err)
													})
												, (err) ->
													cbSample(err) if err
													cbSample(null)
											, (cbPattern) ->
												async.each group.patterns.models, (pattern, eachPatternSavedCallback) ->
													pattern.save({groupId: group.id}, {
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
			], (err, results) =>
				throw new Error(err) if err
				@router.navigate("recipe/#{@recipe.get('id')}", {silent: true})
				@display.log "Recipe \"#{@recipe.get('name')}\" Saved"

		toJSON: (e) ->
			recipe = @recipe.toJSON()
			recipe.groups = []
			@groups.each (group) =>
				groupAttributes = group.toJSON()
				groupAttributes.samples = []
				group.samples.each (sample) =>
					groupAttributes.samples.push(sample.toJSON())
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
			if @keyMap[e.which]?
				@pressing = e.which
				#  left off here trying to listen to press event from pattern and match to pads view
				pad = @current.pads[@keyMap[e.which]]?.trigger('press')

		keyUpDelegate: (e) ->
			pad = @current.pads[@keyMap[e.which]]?.trigger('release') if e.which is @pressing

	new AppView()