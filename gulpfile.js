var gulp                  = require('gulp'),
    uglify                = require('gulp-uglify'),
    path                  = require('path'),
    browserify            = require('browserify'),
    source                = require('vinyl-source-stream'),
    path                  = require('path'),
    APPLICATION_JS_PATH   = path.join('.', 'public' , 'js'),
    packageJson           = require('./package.json'),
    dependencies          = Object.keys(packageJson && packageJson.dependencies || {}).filter(function(packageName) {
      return [
        'GridFS',
        'mongodb',
        'mongodb-wrapper',
        'gridfs-stream',
        'multiparty',
        'socket.io'
      ].indexOf(packageName) === -1;
    });

gulp.task('build:lib', function() {
  return browserify('./main', {
            basedir: './lib',
            extensions: ['.coffee', '.tpl']
          })
          .external(dependencies)
          .on('error', function(err) {
            throw new Error(err);
          })
          .bundle({debug: !process.env.production})
          .pipe(source('application.js'))
          .pipe(gulp.dest(APPLICATION_JS_PATH));
});

gulp.task('build:ext', function() {
  return browserify()
          .require(dependencies)
          .on('error', function(err) {
            throw new Error(err);
          })
          .bundle({debug: !process.env.production})
          .pipe(source('external.js'))
          .pipe(gulp.dest(APPLICATION_JS_PATH))
});

/**
 * distributable build task includes externals bundling,
 * lib bundling and minifying
 */
gulp.task('build:dist', ['build:ext', 'build:lib'], function() {
  return gulp.src(path.join(APPLICATION_JS_PATH, 'application.js'))
      .pipe(uglify({mangle: false}))
      .pipe(gulp.dest(APPLICATION_JS_PATH))
});

gulp.task('watch', function() {
  gulp.watch('package.json', ['build:ext']);
  gulp.watch('lib/**/**', ['build:lib']);
});

/**
 * builds dist,
 * watches package json and lib 
 * and bundles independently
 */
gulp.task('default', ['build:dist', 'watch']);

/**
 * builds distributable app code packages
 */
gulp.task('build', ['build:dist']);
