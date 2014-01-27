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
			@model = options.model || new SoundModel(options)
			@model.view = this
			@model.set('key', String.fromCharCode(@model.get('keyCode')))
			@model.set('name', options.name)
			@render()
			@$pad = @$('.pad')
			@initPlayer()
			new Backbone.Ligaments(model: @model, view: @)

		render: () ->
			@el.innerHTML = @template()

		events:
			'contextmenu'					: 'editSample'
			'mousedown .pad'			: 'press'
			'mouseup .pad'				: 'release'
			'dragover'						: 'prevent'
			'dragenter'						: 'prevent'
			'drop'								: 'loadSample'

		prevent: (e) ->
			e.preventDefault()
			e.stopPropagation()

		press: (e) ->
			# @play()
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
			rendered = null
			delete @T.rendered
			# for effect in @model.get('effects')
			original = @T.raw.clone()
			rendered = T('reverb', {room: 1.1, damp: 0.4, mix: 0.55}, original)
			rendered = T('eq', params: 
					hpf: [50,1], lmf: [828,1.8,18.3], mf: [2400,2.2,-24,5], lpf: [5000,1.1]
			, rendered)
			rendered = T('delay', {}, rendered)
			@T.rendered = original
			return rendered || original

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
			e.stopImmediatePropagation()
			if not @editor
				editor = new SoundEditor(
					model: @model
				)
				editor.show()
				@editor = editor;
			else
				@editor.show()