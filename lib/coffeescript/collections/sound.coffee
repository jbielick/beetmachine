define [
	'underscore'
	'backbone'
	'models/sound'
], (_, Backbone, SoundModel) ->

	class SoundCollection extends Backbone.Collection

		initialize: (models, options = {}) ->
			@group = options.group


		model: SoundModel