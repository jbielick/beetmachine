define [
	'underscore'
	'backbone'
	'deepmodel'
], (_, Backbone, deepmodel) ->
	'use strict';

	class SoundModel extends Backbone.DeepModel

		url: () ->
			if @get('group_id')
				return "/groups/#{@get('group_id')}/sounds"
			else
				return "/sounds"

		initialize: (attrs = {}, options = {}) ->
			_.bindAll this, 'loadSrc'
			@on 'change:src', @loadSrc
			@on 'change:fx:*', () =>
				@timbreContextAttached = false
				@rendered = false

		play: () ->
			if not @rendered
				sound = @renderEffects()
				if not @timbreContextAttached
					@timbreContextAttached = true
					$(sound.play()).one('ended', @onEnded)
				else
					sound.bang()
			else
				if @T.rendered?.playbackState
					@T.rendered.currentTime = 0
				else
					$(@T.rendered.bang()).one('ended', @onEnded)
			return @



		onEnded: ->
			# timbre api http://mohayonao.github.io/timbre.js/audio.html
			@pause()

		renderEffects: (cb) ->

			sound = null

			delete @T.rendered if @T

			@T.rendered = @T.raw.clone()

			_.each @get('fx'), (params, fx) =>
				sound = T(fx, params, sound || @T.rendered)

			@rendered = true

			return sound || @T.rendered

		loadSrc: (model, src, options, cb) ->
			_this = @
			if src || @get('src')
				@loaded = false
				T('audio').load(src || @get('src'), ->
					_this.T = raw: @
					_this.loaded = true
					_this.trigger('loaded')
					cb.call _this, @ if cb
				)
		# defaults:
		# 	fx: {}
				# eq:
				# 	params:
				# 		lpf: 	[20, 		1, 20]
				# 		lf: 	[100, 	1, 20]
				# 		lmf:	[300, 	1, 20]
				# 		mf:		[750, 	1, 20]
				# 		hmf:	[2000, 	1, 20]
				# 		hf:		[7000, 	1, 20]
				# 		hpf:	[20000, 1, 20]
			# key: ''
			# name: ''
			# keyCode: ''
			# src: ''