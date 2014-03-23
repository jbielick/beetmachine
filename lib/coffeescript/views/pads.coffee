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
			@groups = new GroupCollection {position: 1}, pads: @, app: @app
			@currentGroup = @groups.at(0)
			@createPads()
			@bootstrapGroupPads(@currentGroup)
			@render()

			@listenTo(@groups, 'reset', (collection) =>
				collection.each((model) => 
					@bootstrapGroupPads(model)
				)
				@render()
			)

			@listenTo(@groups, 'add', (model) =>
				@bootstrapGroupPads(model)
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
					number: (i - z * 16)
				@pads.push new PadView options

				z++ if i % 16 is 0
				i++

		bootstrapGroupPads: (group) ->
			pos = group.get('position') - 1 or 0
			pads = @pads.slice(pos * 16, pos * 16 + 16)
			_.each pads, (pad, i) ->
				if group.sounds.at(i)?
					pad.bootstrapWithModel(group.sounds.at(i))

		toggleGroupSelectButtons: (group) ->
			$('[data-behavior="selectGroup"]').removeClass('active').filter('[data-meta="' + group + '"]').addClass('active');

		render: (groupNumber = 1) ->
			@$('.pad-container').detach()
			@toggleGroupSelectButtons(groupNumber)

			zeroedIndex = groupNumber - 1
			active = @groups.findWhere(position: groupNumber)

			if typeof active is 'undefined'
				active = @groups.add position: groupNumber

			@currentGroup = active
			@currentPads = @pads.slice(zeroedIndex * 16, zeroedIndex * 16 + 16)
			@app.display.model.set('right', 'Group ' + groupNumber)
			@$el.append(_.pluck(@currentPads, 'el'))