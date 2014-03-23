var Path = require('path');


module.exports = function(grunt) {

	grunt.initConfig({
		// copy: {
		// 	dist: {
		// 		files: [{
		// 			expand: true,
		// 			flatten: true,
		// 			src: ['/*.js'],
		// 			dest: 'dist/'
		// 		}]
		// 	}
		// },
		watch: {
			coffee: {
				files: ['lib/coffeescript/**/*.coffee'],
				tasks: ['coffee:webroot'],
				options: {
					nospawn: true,
					sourceMap: true
				}
			},
			uglify: {
				files: ['public/js/{collections,models,views,routes}/**/*.js'],
				tasks: ['uglify:webroot'],
				options: {

				}
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			webroot: {
				files: [{
					expand: 		true,																						// Enable dynamic expansion.
					cwd: 				'public/js',																		// Src matches are relative to this path.
					src: 				['{collections,views,models,routes}/**/*.js'],	// Actual pattern(s) to match.
					dest: 			'public/js',																		// Destination path prefix.
					ext: 				'.js',																					// Dest filepaths will have this extension.
				}]
			}
		},
		coffee: {
			webroot: {
				files: [{
					expand: 		true,     						// Enable dynamic expansion.
					cwd: 				'lib/coffeescript',      // Src matches are relative to this path.
					src: 				['**/*.coffee'], 				// Actual pattern(s) to match.
					dest: 			'public/js',   					// Destination path prefix.
					ext: 				'.js',   								// Dest filepaths will have this extension.
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.event.on('watch', function(action, filepath) {

		var ext = Path.extname(filepath),
				filename = Path.basename(filepath, ext),
				config = {},
				destination = Path.dirname(filepath).replace('lib/coffeescript', 'public/js');

		if (ext === '.coffee') {
			config[destination + '/' + filename + '.js'] = [filepath];
			grunt.config('coffee.webroot.files', config);
		}

		// if (ext === '.js') {
		// 	config[filepath] = filepath;
		// 	grunt.config('uglify.webroot.files', config);
		// }
	});

	grunt.registerTask('test', ['mocha']);
	grunt.registerTask('default', ['watch']);

}