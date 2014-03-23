'use strict'

define [
	'underscore'
	'backbone'
	'deepmodel'
	'views/pattern'
], (_, Backbone, deepmodel, PatternView) ->

	class PatternModel extends Backbone.DeepModel

		initialize: (attrs = {}, options = {}) ->
			@group = options.group
			@view = new PatternView model: @, app: options.app, pads: options.pads

		url: '/patterns'