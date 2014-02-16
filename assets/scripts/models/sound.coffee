define [
	'underscore'
	'backbone'
	'deepmodel'
], (_, Backbone, deepmodel) ->
	'use strict';

	class SoundModel extends Backbone.DeepModel
		defaults:
			fx: {}
				# eq:
				# 	params:
				# 		lpf: 	[20, 		1, 20]
				# 		lf: 	[100, 	1, 20]
				# 		lmf:	[300, 	1, 20]
				# 		mf:		[750, 	1, 20]
				# 		hmf:	[2000, 	1, 20]
				# 		hf:		[7000, 	1, 20]
				# 		hpf:	[20000, 1, 20]
			key: ''
			name: ''
			keyCode: ''
			src: ''