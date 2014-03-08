'use strict'

define [
	'underscore'
	'backbone'
	'deepmodel'
	'collections/sound'
	'collections/pattern'
], (_, Backbone, deepmodel, SoundCollection, PatternCollection) ->

	class GroupModel extends Backbone.DeepModel

		initialize: (attrs = {}) ->
			@sounds = new SoundCollection attrs.sounds
			@patterns = new PatternCollection attrs.patterns
			@sounds.parent = @
		toJSON: () ->
			shallow = _.extend({}, @attributes)
			shallow.sounds = @sounds.toJSON()
			shallow