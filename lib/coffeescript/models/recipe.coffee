'use strict';

define [
	'underscore'
	'backbone'
	'deepmodel'
], (_, Backbone, deepmodel) ->

	class RecipeModel extends Backbone.DeepModel
		defaults: 
			name: 'New Recipe'

		url: '/recipes'