define [
	'jquery'
	'underscore'
	'backbone'
	'models/sound'
	'views/display'
	'views/sound-editor'
	'ligaments',
	'text!/scripts/templates/pad.ejs'
], ($, _, Backbone, SoundModel, Display, SoundEditor, ligaments, PadTemplate) ->

	class PadView extends Backbone.View

		attributes:
			class: 'small-3 columns pad-container'

		template: _.template PadTemplate

		initialize: (options) ->
			@parent = options.parent
			@model = options.model
			@model.view = this
			# console.log(@model)
			if @model.get('keyCode')
				@model.set('key', String.fromCharCode(@model.get('keyCode')))
			@model.set('name', options.name)
			@render()
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
			'contextmenu .pad'		: 'edit'

		prevent: (e) ->
			e.preventDefault()
			e.stopPropagation()

		press: (e) ->
			@parent.record(@)
			if @loaded
				@play()

		release: (e) ->

		play: () ->
			_this = this

			@$('.pad').addClass 'active'

			if not @contextAttached
				@contextAttached = true
				@renderEffects().play()
			else
				if @T.rendered.playbackState
					@T.rendered.currentTime = 0
				else
					@T.rendered.bang()

			setTimeout(() =>
				@$('.pad').removeClass 'active'
			, 50)

		initPlayer: (objectURL) ->
			_this = @
			@players = []
			if objectURL || @model.get('src')
				T('audio').load(objectURL || @model.get('src'), () ->
					_this.T = raw: @
					# _this.model.set('T.raw', @) # throws call stack max error for objectURL
					_this.loaded = true
				)
				@$('.pad').addClass('mapped')
				Display.log(@model.get('name')+' loaded');

		renderEffects: () ->
			sound = null
			if @T
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

			@model.set('src', URL.createObjectURL(e.dataTransfer.files[0]))
			@initPlayer(URL.createObjectURL(e.dataTransfer.files[0]))
			Display.log('New Sample Uploaded on '+@model.get('name')+': '+e.dataTransfer.files[0].name)

		edit: (e) ->
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
