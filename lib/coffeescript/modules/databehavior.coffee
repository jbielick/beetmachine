define 'databehavior', () =>
	return {
		events: 
			'click [data-behavior]':		'delegateBehavior'

		delegateBehavior: (e) ->
			behavior = $(e.target).data("behavior")
			if @[behavior]?
				@[behavior].call @, e
	}