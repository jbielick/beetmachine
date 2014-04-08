'use strict'

define [
	'underscore'
	'backbone'
	'deepmodel'
	'views/pattern'
], (_, Backbone, deepmodel, PatternView) ->

	class PatternModel extends Backbone.DeepModel

		defaults:
			length: 4

		url: () ->
			if @get('group_id')
				return "/groups/#{@get('group_id')}/patterns"
			else
				return "/patterns"

		initialize: (attrs = {}, options = {}) ->
			@group = options.group
			@view = new PatternView model: @, app: options.app, pads: options.pads
