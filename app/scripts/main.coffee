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
	'soundcloud'
	'backbone'
	'routes/app'
	'views/app-ui'
], ($, foundation, Timbre, SoundCloud, Backbone, Router, AppUi) ->

	window.SC = SoundCloud

	SC.initialize(
		client_id: '0dee6e7b428540e10373263de1cbf711'
	)

	Backbone.history.start()

	$(document).foundation()
	doc = document.documentElement
	doc.setAttribute('data-useragent', navigator.userAgent)

	new AppUi(config)











window.config =
	name: 'default'
	sounds: [{
			x: 0
			y: 0
			src: '/sounds/additiv/1.wav'
			keyCode: 54
		},{
			x: 1
			y: 0
			src: '/sounds/additiv/2.wav'
			keyCode: 55
		},{
			x: 2
			y: 0
			src: '/sounds/additiv/3.wav'
			keyCode: 56
		},{
			x: 3
			y: 0
			src: '/sounds/additiv/4.wav'
			keyCode: 57
		},{
			x: 0
			y: 1
			src: '/sounds/additiv/5.wav'
			keyCode: 89
		},{
			x: 1
			y: 1
			src: '/sounds/additiv/6.wav'
			keyCode: 85
		},{
			x: 2
			y: 1
			src: '/sounds/additiv/7.wav'
			keyCode: 73
		},{
			x: 3
			y: 1
			src: '/sounds/additiv/8.wav'
			keyCode: 79
		},{
			x: 0
			y: 2
			src: '/sounds/additiv/9.wav'
			keyCode: 72
		},{
			x: 1
			y: 2
			src: '/sounds/additiv/10.wav'
			keyCode: 74
		},{
			x: 2
			y: 2
			src: '/sounds/additiv/11.wav'
			keyCode: 75
		},{
			x: 3
			y: 2
			src: '/sounds/additiv/12.wav'
			keyCode: 76
		},{
			x: 0
			y: 3
			src: '/sounds/additiv/13.wav'
			keyCode: 78
		},{
			x: 1
			y: 3
			src: '/sounds/additiv/14.wav'
			keyCode: 77
		},{
			x: 2
			y: 3
			src: '/sounds/additiv/15.wav'
			keyCode: 188
		},{
			x: 3
			y: 3
			src: '/sounds/additiv/16.wav'
			keyCode: 190
		}]