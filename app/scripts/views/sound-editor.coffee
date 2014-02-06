define [
	'jquery'
	'bootstrap'
	'underscore'
	'backbone'
	'ligaments'
	'templates'
	'views/display'
], ($, bootstrap, _, Backbone, ligaments, JST, Display) ->
	class SoundEditorView extends Backbone.View
		template: JST['app/scripts/templates/sound-editor.ejs']
		attributes:
			'class'					: 'modal fade'
		initialize: (options) ->
			@viewVars = {}
			@model = options.model
			@pad = options.pad
			@render()

		events:
			'click [data-behavior]'				: 'delegateBehavior'
			'click canvas'								: 'play'
			'change input.eq'							: 'eq'

		delegateBehavior: (e) ->
			behavior = $(e.currentTarget).data 'behavior'
			if behavior? and _.isFunction this[behavior]
				this[behavior].call this, e

		eq: (e) ->
			param = e.currentTarget.getAttribute('data-param')
			freq = @model.get('fx.eq.params.'+param)
			freq[2] = parseInt($(e.currentTarget).val(), 10)
			@model.set('fx.eq.params.'+param, freq)
			console.log(freq)

		tab: (e) ->
			tab = $(e.currentTarget).data 'tab'
			$(e.currentTarget).addClass('active').siblings().removeClass('active')
			this.$('.tab-pane').hide()
			this.$('.tab-pane'+tab).show()

		toggleEffect: (e) ->
			effect = $(e.currentTarget).data('effect')
			if not @model.get('fx.'+effect)?
				@viewVars.show = effect
				@addEffect(effect)
			else
				delete @viewVars.show
				@removeEffect(effect)

		addEffect: (effect) ->
			switch effect
				when 'reverb'
					fx = {
						room			: 0
						damp			: 0
						mix				: 0.5
					}
				when 'delay'
					fx = {
						time			: 100
						fb				: 0.2
						mix				: 0.33
					}
				when 'chorus'
					fx = {
						type			: 'sin'		# or 'tri'
						delay			: 20			# 0.5 ... 80
						rate			: 4				# 0 ... 10
						depth			: 20 			# 0 ... 100
						fb				: 0.2 		# -1 ... 1
						wet				: 0.33		# 0 ... 1
					}

			@model.set('fx.'+effect, fx)

			@render()

		removeEffect: (effect) ->
			@model.unset('fx.'+effect)
			@render()

		play: (e) ->
			e.preventDefault()
			e.stopPropagation()
			@pad.play()

		show: () ->
			@$el.modal('show')

		hide: () ->
			@$el.modal('hide')

		render: () ->
			@el.innerHTML = @template(
				data: @model.toJSON()
				view: @viewVars
			)
			new Backbone.Ligaments(model: @model, view: @)
			@$canvas = this.$('.waveform');
			@pad.T.raw.plot(
				target: @$canvas.get(0)
				background: 'rgb(70,70,70)'
				foreground: '#f08a24'
			)