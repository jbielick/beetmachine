Backbone 						= require('backbone')
BackboneNested 			= require('backbone-nested')
_										= require('underscore')

class RecipeModel extends Backbone.NestedModel
	defaults: 
		name: 'New Recipe'

	urlRoot: '/recipes'

module.exports = RecipeModel