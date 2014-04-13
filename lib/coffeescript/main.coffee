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
		bootstrap: ['jquery']
		soundcloud: 
			exports: 'SC'
		timbre:
			exports: 'T'
	paths:
		jquery					: '/bower_components/jquery/jquery'
		backbone 				: '/bower_components/backbone/backbone'
		deepmodel				: '/bower_components/backbone-deep-model/distribution/deep-model'
		underscore			: '/bower_components/underscore/underscore'
		text						: '/bower_components/requirejs-text/text'
		foundation			: 'vendor/foundation.min'
		dropzone				: 'vendor/dropzone.min'
		ligaments				: 'vendor/ligaments'
		soundcloud			: 'http://connect.soundcloud.com/sdk'
		bootstrap				: 'vendor/bootstrap.min'
		timbre 					: 'vendor/timbre.dev'
		socketio				: 'vendor/socket.io'
		async						: '/bower_components/async/lib/async'
		paper						: '/bower_components/paper/dist/paper-full.min'

require [
	'jquery'
	'foundation'
	'socketio'
	'timbre'
	# 'soundcloud'
	'backbone'
	'views/app'
], ($, foundation, io, Timbre, Backbone, App) ->

	# window.SC = SoundCloud

	# SC.initialize(
	# 	client_id: '0dee6e7b428540e10373263de1cbf711'
	# )

	Backbone.history.start({pushState: true})

	$(document).foundation()
	doc = document.documentElement
	doc.setAttribute('data-useragent', navigator.userAgent)
