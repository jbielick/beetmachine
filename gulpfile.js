var gulp 		= require('gulp'),
		// jshint = require('gulp-jshint'),
		// concat = require('gulp-concat'),
		uglify 	= require('gulp-uglify'),
		path 		= require('path'),
		coffee 	= require('gulp-coffee');

gulp.task('watch', function() {
	gulp.watch('lib/coffeescript/**/*.coffee', function(e) {
		var src = path.relative('.', e.path);
		gulp.src(src)
				.pipe(coffee()).on('error', function() {console.log(arguments[0])})
				// .pipe(uglify({mangle: false}))
				.pipe(gulp.dest(path.dirname(src).replace('lib/coffeescript', 'public/js')));
		console.log('<< Compiled and Minified ' + src);
	});
});

gulp.task('coffee:batch', function() {
	gulp.src('lib/coffeescript/**/*.coffee')
			.pipe(coffee()).on('error', function(err) {console.log(err)})
			// .pipe(uglify({mangle: false}))
			.pipe(gulp.dest('public/js'));
});