define [
	'jquery'
	'underscore'
	'backbone'
	'views/pad'
	'collections/group'
	'text!/js/templates/pads.ejs'
], ($, _, Backbone, PadView, GroupCollection, PadsTemplate) ->

	class PadsView extends Backbone.View

		el: '.pads'

		template: _.template PadsTemplate

		colorMap: 
			'1': '#ADD5FF'
			'2': '#FF8D8D'
			'3': '#BBBBD4'
			'4': '#EBECF2'
			'5': '#FFE97F'

		initialize: (options) ->
			@app = options.parent
			@groups = new GroupCollection {}, view: @
			@currentGroup = @groups.at(0)
			@createPads()
			@mapPads(@currentGroup)
			@render()

			@listenTo(@groups, 'reset', (collection) =>
				collection.each((model) => 
					@mapPads(model)
				)
				@render(1)
			)

			@listenTo(@groups, 'add', (model) =>
				@mapPads(model)
				@render(model.get('position'))
			)

		createPads: () ->
			@pads = []
			i = 1
			z = 0
			while i <= 128
				options = 
					name: 'c'+(i - z * 16)
					parent: @
				@pads.push new PadView options

				z++ if i % 16 is 0
				i++

		mapPads: (group) ->
			pos = group.get('position') - 1 or 0
			pads = @pads.slice(pos * 16, pos * 16 + 16)
			_.each(pads, (pad, i) ->
				if group.sounds.at(i)?
					pad.map(group.sounds.at(i))
			)

		record: (pad) ->
			if @app.transport._recording
				tick = @app.transport.getTick()
				# trigger = 

				@app.transport.pattern or (@app.transport.pattern = {})
				@app.transport.pattern[tick] or (@app.transport.pattern[tick] = [])
				@app.transport.pattern[tick].push(pad.model.get('sound'))

		render: (group = 1) ->
			@$('.pad-container').detach()
			$('[data-behavior="selectGroup"]').removeClass('active').filter('[data-meta="'+group+'"]').addClass('active');
			zeroedIndex = group - 1
			@currentGroup = @groups.findWhere(position: group)
			@currentPads = @pads.slice(zeroedIndex * 16, zeroedIndex * 16 + 16)
			@app.display.model.set('right', 'Group '+group)
			@$el.append(_.pluck(@currentPads, 'el'))