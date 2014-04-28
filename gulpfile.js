var gulp 								= require('gulp'),
		uglify 							= require('gulp-uglify'),
		path 								= require('path'),
		browserify 					= require('browserify'),
		source 							= require('vinyl-source-stream'),
		APPLICATION_JS_PATH = './public/js/';

gulp.task('browserify', function() {
	return browserify('./main', {
						basedir: './lib',
						extensions: ['.coffee', '.tpl']
					})
					.on('error', function(err) {
						throw new Error(err);
					})
					.bundle({debug: false})
					.pipe(source('application.js'))
					.pipe(gulp.dest(APPLICATION_JS_PATH));
});

gulp.task('build:coffee', ['browserify']);

gulp.task('build:dist', ['browserify'], function() {
	return gulp.src(APPLICATION_JS_PATH + 'application.js')
			.pipe(uglify({mangle: false}))
			.pipe(gulp.dest(APPLICATION_JS_PATH))
});

gulp.task('watch', function() {
	gulp.watch('lib/**/**', ['build:coffee']);
});

gulp.task('build', ['build:dist']);
