'use strict';
var SERVER_PORT = 9000;
var mountFolder = function (connect, dir) {
		return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
		// show elapsed time at the end
		require('time-grunt')(grunt);
		// load all grunt tasks
		require('load-grunt-tasks')(grunt);

		// configurable paths
		var yeomanConfig = {
				app: 'app',
				dist: 'dist'
		};

		grunt.initConfig({
				yeoman: yeomanConfig,
				watch: {
						options: {
								nospawn: true
						},
						coffee: {
								files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
								tasks: ['coffee:dist']
						},
						coffeeTest: {
								files: ['test/spec/{,*/}*.coffee'],
								tasks: ['coffee:test']
						},
						jst: {
								files: [
										'<%= yeoman.app %>/scripts/templates/*.ejs'
								],
								tasks: ['jst']
						},
						test: {
								files: ['<%= yeoman.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
								tasks: ['test']
						}
				},
				connect: {
						options: {
								port: SERVER_PORT,
								// change this to '0.0.0.0' to access the server from outside
								hostname: 'localhost'
						},
						test: {
								options: {
										port: 9001,
										middleware: function (connect) {
												return [
														lrSnippet,
														mountFolder(connect, 'sails/assets'),
														mountFolder(connect, 'test'),
														mountFolder(connect, yeomanConfig.app)
												];
										}
								}
						},
						dist: {
								options: {
										middleware: function (connect) {
												return [
														mountFolder(connect, yeomanConfig.dist)
												];
										}
								}
						}
				},
				open: {
						server: {
								path: 'http://localhost:<%= connect.options.port %>'
						}
				},
				clean: {
						dist: ['sails/assets', '<%= yeoman.dist %>/*'],
						server: 'sails/assets'
				},
				jshint: {
						options: {
								jshintrc: '.jshintrc',
								reporter: require('jshint-stylish')
						},
						all: [
								'Gruntfile.js',
								'<%= yeoman.app %>/scripts/{,*/}*.js',
								'!<%= yeoman.app %>/scripts/vendor/*',
								'test/spec/{,*/}*.js'
						]
				},
				mocha: {
						all: {
								options: {
										run: true,
										urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
								}
						}
				},
				coffee: {
						dist: {
								files: [{
										// rather than compiling multiple files here you should
										// require them into your main .coffee file
										expand: true,
										cwd: '<%= yeoman.app %>/scripts',
										src: '{,*/}*.coffee',
										dest: 'sails/assets/scripts',
										ext: '.js'
								}]
						},
						test: {
								files: [{
										expand: true,
										cwd: 'test/spec',
										src: '{,*/}*.coffee',
										dest: 'sails/assets/spec',
										ext: '.js'
								}]
						}
				},
				requirejs: {
						dist: {
								options: {
										baseUrl: 'sails/assets/scripts',
										optimize: 'none',
										paths: {
												'templates': '../../sails/assets/scripts/templates',
												'jquery': '../../app/bower_components/jquery/jquery',
												'underscore': '../../app/bower_components/underscore/underscore',
												'backbone': '../../app/bower_components/backbone/backbone',
												'deepmodel': '../../app/bower_components/backbone-deep-model/distribution/deep-model'
										},
										// TODO: Figure out how to make sourcemaps work with grunt-usemin
										// https://github.com/yeoman/grunt-usemin/issues/30
										//generateSourceMaps: true,
										// required to support SourceMaps
										// http://requirejs.org/docs/errors.html#sourcemapcomments
										preserveLicenseComments: false,
										useStrict: true,
										wrap: true
										//uglify2: {} // https://github.com/mishoo/UglifyJS2
								}
						}
				},
				useminPrepare: {
						html: '<%= yeoman.app %>/index.html',
						options: {
								dest: '<%= yeoman.dist %>'
						}
				},
				usemin: {
						html: ['<%= yeoman.dist %>/{,*/}*.html'],
						css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
						options: {
								dirs: ['<%= yeoman.dist %>']
						}
				},
				imagemin: {
						dist: {
								files: [{
										expand: true,
										cwd: '<%= yeoman.app %>/images',
										src: '{,*/}*.{png,jpg,jpeg}',
										dest: '<%= yeoman.dist %>/images'
								}]
						}
				},
				cssmin: {
						dist: {
								files: {
										'<%= yeoman.dist %>/styles/main.css': [
												'sails/assets/styles/{,*/}*.css',
												'<%= yeoman.app %>/styles/{,*/}*.css'
										]
								}
						}
				},
				uglify: {
						dist: {
								files: {
										'<%= yeoman.dist %>/scripts/scripts.js': [
												'<%= yeoman.dist %>/scripts/scripts.js'
										]
								}
						}
				},
				concat: {
						dist: {}
				},
				htmlmin: {
						dist: {
								options: {
										/*removeCommentsFromCDATA: true,
										// https://github.com/yeoman/grunt-usemin/issues/44
										//collapseWhitespace: true,
										collapseBooleanAttributes: true,
										removeAttributeQuotes: true,
										removeRedundantAttributes: true,
										useShortDoctype: true,
										removeEmptyAttributes: true,
										removeOptionalTags: true*/
								},
								files: [{
										expand: true,
										cwd: '<%= yeoman.app %>',
										src: '*.html',
										dest: '<%= yeoman.dist %>'
								}]
						}
				},
				copy: {
						vendorjs: {
								files: [{
										expand: true,
										dot: true,
										cwd: '<%= yeoman.app %>/scripts/vendor',
										dest: 'sails/assets/scripts/vendor',
										src: [
												'*.js'
										]
								}]
						},
						dist: {
								files: [{
										expand: true,
										dot: true,
										cwd: '<%= yeoman.app %>',
										dest: '<%= yeoman.dist %>',
										src: [
												'*.{ico,txt}',
												'.htaccess',
												'images/{,*/}*.{webp,gif}',
												'styles/fonts/{,*/}*.*',
										]
								}]
						}
				},
				bower: {
						all: {
								rjsConfig: '<%= yeoman.app %>/scripts/main.js'
						}
				},
				jst: {
						options: {
								amd: true
						},
						compile: {
								files: {
										'sails/assets/scripts/templates.js': ['<%= yeoman.app %>/scripts/templates/*.ejs']
								}
						}
				},
				rev: {
						dist: {
								files: {
										src: [
												'<%= yeoman.dist %>/scripts/{,*/}*.js',
												'<%= yeoman.dist %>/styles/{,*/}*.css',
												'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
												'/styles/fonts/{,*/}*.*',
										]
								}
						}
				}
		});

		grunt.registerTask('createDefaultTemplate', function () {
				grunt.file.write('sails/assets/scripts/templates.js', 'this.JST = this.JST || {};');
		});

		grunt.registerTask('server', function (target) {
				if (target === 'dist') {
						return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
				}

				if (target === 'test') {
						return grunt.task.run([
								'clean:server',
								'coffee',
								'createDefaultTemplate',
								'jst',
								'connect:test'
						]);
				}

				grunt.task.run([
						'clean:server',
						'coffee:dist',
						'createDefaultTemplate',
						'jst',
						'open',
						'watch'
				]);
		});

		grunt.registerTask('test', [
				'clean:server',
				'coffee',
				'createDefaultTemplate',
				'jst',
				'connect:test',
				'mocha',
				'watch:test'
		]);

		grunt.registerTask('build', [
				'clean:dist',
				'coffee',
				'createDefaultTemplate',
				'jst',
				'useminPrepare',
				'copy:vendorjs',
				'requirejs',
				'imagemin',
				'htmlmin',
				'concat',
				'cssmin',
				'uglify',
				'copy:dist',
				'rev',
				'usemin'
		]);

		grunt.registerTask('default', [
				'jshint',
				'test',
				'build'
		]);
};
