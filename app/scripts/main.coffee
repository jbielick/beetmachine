#/*global require*/
'use strict'

require.config
	shim:
		underscore:
			exports: '_'
		backbone:
			deps: [
				'underscore'
				'jquery'
			]
			exports: 'Backbone'
		foundation: ['jquery']
		soundcloud: 
			exports: 'SC'
		timbre:
			exports: 'T'
	paths:
		jquery					: '../bower_components/jquery/jquery'
		backbone 				: '../bower_components/backbone/backbone'
		deepmodel				: '../bower_components/backbone-deep-model/distribution/deep-model.min'
		underscore			: '../bower_components/underscore/underscore'
		foundation			: 'vendor/foundation.min'
		dropzone				: 'vendor/dropzone.min'
		ligaments				: 'vendor/ligaments'
		soundcloud			: 'http://connect.soundcloud.com/sdk'
		bootstrap				: 'vendor/bootstrap.min'
		timbre 					: 'vendor/timbre.dev'

require [
	'jquery'
	'foundation'
	'timbre'
	# 'soundcloud'
	'backbone'
	'routes/app'
	'views/app-ui'
	'projects/test'
], ($, foundation, Timbre, Backbone, Router, App, testProject) ->

	# window.SC = SoundCloud

	# SC.initialize(
	# 	client_id: '0dee6e7b428540e10373263de1cbf711'
	# )

	Backbone.history.start({pushState: false})

	$(document).foundation()
	doc = document.documentElement
	doc.setAttribute('data-useragent', navigator.userAgent)

	App.open(testProject)