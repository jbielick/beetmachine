define [
	'jquery'
	'underscore'
	'backbone'
	'templates'
	'models/sound'
	'views/display'
	'views/sound-editor'
	'ligaments'
], ($, _, Backbone, JST, SoundModel, Display, SoundEditor) ->
	class PadView extends Backbone.View
		attributes:
			class: 'small-3 columns pad-container'

		template: JST['app/scripts/templates/pad.ejs']

		initialize: (options) ->
			@model = options.model
			@model.view = this
			@model.set('key', String.fromCharCode(@model.get('keyCode')))
			@model.set('name', options.name)
			@render()
			@$pad = @$('.pad')
			@initPlayer()
			new Backbone.Ligaments(model: @model, view: @)

			@listenTo(@model, 'change', () ->
				@contextAttached = false
				@renderEffects()
			)

		render: () ->
			@el.innerHTML = @template()

		events:
			'mousedown .pad'			: 'press'
			'mouseup .pad'				: 'release'
			'dragover'						: 'prevent'
			'dragenter'						: 'prevent'
			'drop'								: 'loadSample'
			'contextmenu .pad'		: 'editSample'

		prevent: (e) ->
			e.preventDefault()
			e.stopPropagation()

		press: (e) ->
			if @loaded
				@$pad.addClass 'active'
				@play()

		release: (e) ->
			@$pad.removeClass 'active'

		play: () ->
			_this = this

			if not @contextAttached
				@contextAttached = true
				@renderEffects().play()
			else
				if @T.rendered.playbackState
					@T.rendered.currentTime = 0
				else
					@T.rendered.bang()

		initPlayer: (objectURL) ->
			_this = @
			delete @players
			@players = []
			T('audio').load(objectURL || @model.get('src'), () ->
				_this.T = raw: @
				# _this.model.set('T.raw', @) # throws call stack max error for objectURL
				_this.loaded = true
			)
			@$pad.addClass('mapped')
			Display.log(@model.get('name')+' loaded');

		renderEffects: () ->
			sound = null
			delete @T.rendered

			original = @T.raw.clone()

			_.each(@model.get('fx'), (params, fx) ->
				sound = T(fx, params, sound || original)
			)
			# rendered = T('delay', {}, sound)
			@T.rendered = original
			return sound || original

		loadSample: (e) ->
			e = e.originalEvent
			e.preventDefault()
			e.stopPropagation()

			# Code for <AUDIO> element implementation
			#
			# @sound.onload = (e) =>
				# URL.revokeObjectURL(@sound.src)
				# Display.model.set('two', 'New Sample Uploaded and Initialized')
				# console.log('loaded')
			#
			# /Code for <AUDIO> element implementation

			@model.set('src', URL.createObjectURL(e.dataTransfer.files[0]))
			@initPlayer(URL.createObjectURL(e.dataTransfer.files[0]))
			Display.log('New Sample Uploaded on '+@model.get('name')+': '+e.dataTransfer.files[0].name)

		editSample: (e) ->
			e.preventDefault()
			e.stopPropagation()
			e.stopImmediatePropagation()
			if not @editor
				editor = new SoundEditor(
					model: @model
					pad: this
				)
				editor.show()
				@editor = editor;
			else
				@editor.show()
