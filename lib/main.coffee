#/*global require*/
'use strict'

# 		foundation			: 'vendor/foundation.min'
# 		soundcloud			: 'http://connect.soundcloud.com/sdk'
# 		bootstrap				: 'vendor/bootstrap.min'
# 		socketio				: 'vendor/socket.io'
# 		paper						: '/bower_components/paper/dist/paper-full.min'

# require [
# 	'jquery'
# 	'foundation'
# 	'socketio'
# 	'timbre'
# 	'views/app'
# ], ($, foundation, io, Timbre, Backbone, App) ->

# $						= window.$ = window.jQuery = require('jquery')
# bootstrap 	= require('./bower_components/bootstrap/dist/js/bootstrap')
# _						= require('underscore')
# Backbone 		= require('backbone', expose: 'backbone')
# Backbone.$ 	= $
# T 					= require('./vendor/timbre')

	# window.SC = SoundCloud

	# SC.initialize(
	# 	client_id: '0dee6e7b428540e10373263de1cbf711'
	# )

window.Beet	= window.Beet || require('./views/app')