define [
	'jquery'
	'underscore'
	'backbone'
	'models/sound'
	'views/editor'
	'ligaments',
	'text!/js/templates/pad.ejs'
], ($, _, Backbone, SoundModel, SoundEditor, ligaments, PadTemplate) ->

	class PadView extends Backbone.View

		attributes:
			class: 'small-3 columns pad-container'

		template: _.template PadTemplate

		initialize: (options) ->
			@parent = options.parent
			@name = options.name

			_.bindAll @, 'listenToModelChanges', 'press'

			# pad doesn't have a model by default, so when one is created or bootstrapped, 
			# we emit an event so that we can begin listening for "press" and "change" events to rerender and such
			@on 'modelPresent', @listenToModelChanges

			@render()

		listenToModelChanges: () ->
			@stopListening @model, 'press'
			@listenTo @model, 'press', @press

			@stopListening @model, 'change:fx.*'
			@listenTo @model, 'change:fx.*', (model, attrs) =>
				@timbreContextAttached = false
				@rendered = false

		bootstrapWithModel: (sound) ->
			if not sound and
				not sound instanceof SoundModel 
				then throw new Error 'Must provide a SoundModel instance when mapping a pad.'

			(@model = sound).pad = @

			if @model.get 'keyCode'
				@model.set('key', String.fromCharCode @model.get('keyCode'))

			new Backbone.Ligaments model: @model, view: @

			@loadSrc @model.get('src'), () =>
				@trigger 'modelPresent'

		render: () ->
			@el.innerHTML = @template name: @name

		events:
			'contextmenu .pad'		: 'edit'
			'mousedown .pad'			: 'press'
			'mouseup .pad'				: 'release'
			'dragover'						: 'prevent'
			'dragenter'						: 'prevent'
			'drop'								: 'uploadSample'

		prevent: (e) ->
			e.preventDefault()
			e.stopPropagation()

		press: (e) ->
			return true if e and e.button is 2
			@$('.pad').addClass 'active'

			# if e.originalEvent and e.originalEvent not instanceof MouseEvent
			setTimeout(() =>
				@$('.pad').removeClass 'active'
			, 50)

			if @loaded
				@play().parent.record(@)

		release: (e) ->
			# @$('.pad').removeClass 'active'

		play: () ->
			_this = _this

			if not @rendered
				sound = @renderEffects()
				if not @timbreContextAttached
					@timbreContextAttached = true
					sound.play()
				else
					sound.bang()
			else
				if @T.rendered?.playbackState
					@T.rendered.currentTime = 0
				else
					@T.rendered.bang()
			return @

		###
		 # creates a new model when a pad has a file dropped
		 # onto it. Add itself to the current group's SoundCollection
		###
		createModel: (attrs = {}) ->
			@model = new SoundModel _.extend pad: @$el.index() + 1, attrs
			@parent.currentGroup.sounds.add @model
			return @model

		loadSrc: (url, cb) ->
			_this = @

			if url || @model.get('src')
				T('audio').load(url || @model.get('src'), () ->
					_this.T = raw: @
					_this.loaded = true
					_this.$('.pad').addClass('mapped')
					
					_this.parent.app.display.log(_this.name+' loaded')
					cb.call _this, @ if cb
				)

		renderEffects: (cb) ->

			sound = null

			delete @T.rendered if @T

			@T.rendered = @T.raw.clone()

			_.each(@model.get('fx'), (params, fx) =>
				sound = T(fx, params, sound || @T.rendered)
			)

			@rendered = true

			return sound || @T.rendered

		uploadSample: (e) ->
			e = e.originalEvent
			e.preventDefault()
			e.stopPropagation()

			if not @model
				@createModel()

			objectUrl = URL.createObjectURL(e.dataTransfer.files[0])

			@model.set('src', objectUrl, silent: true)
			@loadSrc objectUrl, () =>
				@trigger 'modelPresent'

			@parent.app.display.log('New Sample Uploaded on ' + @name + ': ' + e.dataTransfer.files[0].name)

		edit: (e) ->
			e.preventDefault()
			if not @editor
				editor = new SoundEditor(
					model: @model || @createModel()
					pad: this
				)
				@editor = editor;
			else
				@editor.show()