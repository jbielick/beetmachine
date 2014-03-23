define [
	'underscore'
	'backbone'
	'models/group'
], (_, Backbone, GroupModel) ->

	class GroupCollection extends Backbone.Collection

		initialize: (attrs = {}, options = {}) ->
			@app = options.app
			@pads = options.pads

		model: GroupModel

		comparator: 'position'

		url: '/groups'