define [
	'underscore'
	'backbone'
	'models/sound'
], (_, Backbone, SoundModel) ->

	class SoundCollection extends Backbone.Collection
		model: SoundModel