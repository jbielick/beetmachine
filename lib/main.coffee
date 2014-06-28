#/*global require*/
'use strict'

# 		foundation			: 'vendor/foundation.min'
# 		soundcloud			: 'http://connect.soundcloud.com/sdk'
# 		bootstrap				: 'vendor/bootstrap.min'
# 		socketio				: 'vendor/socket.io'
# 		paper						: '/bower_components/paper/dist/paper-full.min'


# bootstrap 	= require('./bower_components/bootstrap/dist/js/bootstrap')
# T 					= require('./vendor/timbre')

	# SC.initialize(
	# 	client_id: '0dee6e7b428540e10373263de1cbf711'
	# )

App = require('./views/app')

window.Beet	|| window.Beet = new App