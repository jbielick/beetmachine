
module.exports = function (grunt) {



	/**
	 * CSS files to inject in order
	 * (uses Grunt-style wildcard/glob/splat expressions)
	 *
	 * By default, Sails also supports LESS in development and production.
	 * To use SASS/SCSS, Stylus, etc., edit the `sails-linker:devStyles` task 
	 * below for more options.  For this to work, you may need to install new 
	 * dependencies, e.g. `npm install grunt-contrib-sass`
	 */

	var cssFilesToInject = [
		'linker/**/*.css'
	];


	/**
	 * Javascript files to inject in order
	 * (uses Grunt-style wildcard/glob/splat expressions)
	 *
	 * To use client-side CoffeeScript, TypeScript, etc., edit the 
	 * `sails-linker:devJs` task below for more options.
	 */

	var jsFilesToInject = [

		// Below, as a demonstration, you'll see the built-in dependencies 
		// linked in the proper order order

		// Bring in the socket.io client
		'linker/js/socket.io.js',

		// then beef it up with some convenience logic for talking to Sails.js
		'linker/js/sails.io.js',

		// A simpler boilerplate library for getting you up and running w/ an
		// automatic listener for incoming messages from Socket.io.
		'linker/js/app.js',

		// *->    put other dependencies here   <-*

		// All of the rest of your app scripts imported here
		'linker/**/*.js'
	];


	/**
	 * Client-side HTML templates are injected using the sources below
	 * The ordering of these templates shouldn't matter.
	 * (uses Grunt-style wildcard/glob/splat expressions)
	 * 
	 * By default, Sails uses JST templates and precompiles them into 
	 * functions for you.  If you want to use jade, handlebars, dust, etc.,
	 * edit the relevant sections below.
	 */

	var templateFilesToInject = [
		'linker/**/*.html'
	];



	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	//
	// DANGER:
	//
	// With great power comes great responsibility.
	//
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////

	// Modify css file injection paths to use 
	cssFilesToInject = cssFilesToInject.map(function (path) {
		return '.tmp/public/' + path;
	});

	// Modify js file injection paths to use 
	jsFilesToInject = jsFilesToInject.map(function (path) {
		return '.tmp/public/' + path;
	});
	
	
	templateFilesToInject = templateFilesToInject.map(function (path) {
		return 'assets/' + path;
	});


	// Get path to core grunt dependencies from Sails
	var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
	grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
	grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-jst/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-less/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-coffee/tasks');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			dev: {
				files: [
					{
					expand: true,
					cwd: './assets',
					src: ['**/*.!(coffee)'],
					dest: '.tmp/public'
				}
				]
			},
			build: {
				files: [
					{
					expand: true,
					cwd: '.tmp/public',
					src: ['**/*'],
					dest: 'www'
				}
				]
			}
		},

		clean: {
			dev: ['.tmp/public/**'],
			build: ['www']
		},

		jst: {
			dev: {

				// To use other sorts of templates, specify the regexp below:
				// options: {
				//   templateSettings: {
				//     interpolate: /\{\{(.+?)\}\}/g
				//   }
				// },

				files: {
					'.tmp/public/jst.js': templateFilesToInject
				}
			}
		},

		less: {
			dev: {
				files: [
					{
					expand: true,
					cwd: 'assets/styles/',
					src: ['*.less'],
					dest: '.tmp/public/styles/',
					ext: '.css'
				}, {
					expand: true,
					cwd: 'assets/linker/styles/',
					src: ['*.less'],
					dest: '.tmp/public/linker/styles/',
					ext: '.css'
				}
				]
			}
		},
		
		coffee: {
			dev: {
				options:{
					bare:true
				},
				files: [
					{
						expand: true,
						cwd: 'assets/scripts/',
						src: ['**/*.coffee'],
						dest: '.tmp/public/scripts/', 
						ext: '.js'
					}, {
						expand: true,
						cwd: 'assets/linker/js/',
						src: ['**/*.coffee'],
						dest: '.tmp/public/linker/js/',
						ext: '.js'
					}
				]
			}
		},

		concat: {
			js: {
				src: jsFilesToInject,
				dest: '.tmp/public/concat/production.js'
			},
			css: {
				src: cssFilesToInject,
				dest: '.tmp/public/concat/production.css'
			}
		},

		uglify: {
			dist: {
				src: ['.tmp/public/concat/production.js'],
				dest: '.tmp/public/min/production.js'
			}
		},

		cssmin: {
			dist: {
				src: ['.tmp/public/concat/production.css'],
				dest: '.tmp/public/min/production.css'
			}
		},

		'sails-linker': {

			devJs: {
				options: {
					startTag: '<!--SCRIPTS-->',
					endTag: '<!--SCRIPTS END-->',
					fileTmpl: '<script src="%s"></script>',
					appRoot: '.tmp/public'
				},
				files: {
					'.tmp/public/**/*.html': jsFilesToInject,
					'views/**/*.html': jsFilesToInject,
					'views/**/*.ejs': jsFilesToInject
				}
			},

			prodJs: {
				options: {
					startTag: '<!--SCRIPTS-->',
					endTag: '<!--SCRIPTS END-->',
					fileTmpl: '<script src="%s"></script>',
					appRoot: '.tmp/public'
				},
				files: {
					'.tmp/public/**/*.html': ['.tmp/public/min/production.js'],
					'views/**/*.html': ['.tmp/public/min/production.js'],
					'views/**/*.ejs': ['.tmp/public/min/production.js']
				}
			},

			devStyles: {
				options: {
					startTag: '<!--STYLES-->',
					endTag: '<!--STYLES END-->',
					fileTmpl: '<link rel="stylesheet" href="%s">',
					appRoot: '.tmp/public'
				},

				// cssFilesToInject defined up top
				files: {
					'.tmp/public/**/*.html': cssFilesToInject,
					'views/**/*.html': cssFilesToInject,
					'views/**/*.ejs': cssFilesToInject
				}
			},

			prodStyles: {
				options: {
					startTag: '<!--STYLES-->',
					endTag: '<!--STYLES END-->',
					fileTmpl: '<link rel="stylesheet" href="%s">',
					appRoot: '.tmp/public'
				},
				files: {
					'.tmp/public/index.html': ['.tmp/public/min/production.css'],
					'views/**/*.html': ['.tmp/public/min/production.css'],
					'views/**/*.ejs': ['.tmp/public/min/production.css']
				}
			},

			devTpl: {
				options: {
					startTag: '<!--TEMPLATES-->',
					endTag: '<!--TEMPLATES END-->',
					fileTmpl: '<script type="text/javascript" src="%s"></script>',
					appRoot: '.tmp/public'
				},
				files: {
					'.tmp/public/index.html': ['.tmp/public/jst.js'],
					'views/**/*.html': ['.tmp/public/jst.js'],
					'views/**/*.ejs': ['.tmp/public/jst.js']
				}
			},


			devJsJADE: {
				options: {
					startTag: '// SCRIPTS',
					endTag: '// SCRIPTS END',
					fileTmpl: 'script(type="text/javascript", src="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': jsFilesToInject
				}
			},

			prodJsJADE: {
				options: {
					startTag: '// SCRIPTS',
					endTag: '// SCRIPTS END',
					fileTmpl: 'script(type="text/javascript", src="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': ['.tmp/public/min/production.js']
				}
			},

			devStylesJADE: {
				options: {
					startTag: '// STYLES',
					endTag: '// STYLES END',
					fileTmpl: 'link(rel="stylesheet", href="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': cssFilesToInject
				}
			},

			prodStylesJADE: {
				options: {
					startTag: '// STYLES',
					endTag: '// STYLES END',
					fileTmpl: 'link(rel="stylesheet", href="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': ['.tmp/public/min/production.css']
				}
			},

			devTplJADE: {
				options: {
					startTag: '// TEMPLATES',
					endTag: '// TEMPLATES END',
					fileTmpl: 'script(type="text/javascript", src="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': ['.tmp/public/jst.js']
				}
			}
		},

		watch: {
			api: {
				files: ['api/**/*']
			},
			assets: {
				files: ['assets/**/*'],
				tasks: ['compileAssets', 'linkAssets']
			}
		}
	});

	// When Sails is lifted:
	grunt.registerTask('default', [
		'compileAssets',
		'watch'
	]);

	grunt.registerTask('compileAssets', [
		'clean:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);

	grunt.registerTask('linkAssets', [

		// Update link/script/template references in `assets` index.html
		'sails-linker:devJs',
		'sails-linker:devStyles',
		'sails-linker:devTpl',
		'sails-linker:devJsJADE',
		'sails-linker:devStylesJADE',
		'sails-linker:devTplJADE'
	]);


	// Build the assets into a web accessible folder.
	// (handy for phone gap apps, chrome extensions, etc.)
	grunt.registerTask('build', [
		'compileAssets',
		'linkAssets',
		'clean:build',
		'copy:build'
	]);

	// When sails is lifted in production
	grunt.registerTask('prod', [
		'clean:dev',
		'jst:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev',
		'concat',
		'uglify',
		'cssmin',
		'sails-linker:prodJs',
		'sails-linker:prodStyles',
		'sails-linker:devTpl',
		'sails-linker:prodJsJADE',
		'sails-linker:prodStylesJADE',
		'sails-linker:devTplJADE'
	]);

	// When API files are changed:
	// grunt.event.on('watch', function(action, filepath) {
	//   grunt.log.writeln(filepath + ' has ' + action);

	//   // Send a request to a development-only endpoint on the server
	//   // which will reuptake the file that was changed.
	//   var baseurl = grunt.option('baseurl');
	//   var gruntSignalRoute = grunt.option('signalpath');
	//   var url = baseurl + gruntSignalRoute + '?action=' + action + '&filepath=' + filepath;

	//   require('http').get(url)
	//   .on('error', function(e) {
	//     console.error(filepath + ' has ' + action + ', but could not signal the Sails.js server: ' + e.message);
	//   });
	// });
};
