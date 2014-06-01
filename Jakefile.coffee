# coffee 				= require('coffee-script')
# fs 						= require('fs')
# browserify 		= require('browserify')
# b 						= browserify './main',
# 									basedir: './lib'
# 									extensions: ['.coffee', '.tpl']

# testTask 'beetmachine', ->
#   this.testFiles.include('test/*.js')
#   this.testFiles.include('test/**/*.js')

# watchTask ['build'], ->
# 	this.watchFiles.include ['./lib/**/*.coffee']
# 	this.watchFiles.exclude ['./lib/bower_components/**', './lib/vendor/**']

# desc 'Build CoffeeScripts'
# task 'build', [], ->
# 	b.bundle(debug: true).pipe fs.createWriteStream('./public/js/application.js')