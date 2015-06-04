var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    mocha = require('gulp-spawn-mocha'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    karma = require('karma').server,
    runner = require('karma').runner,
    path = require('path');

  console.log(karma)

gulp.task('watch', ['connect', 'tdd'], function() {
  gulp.watch('{src,test}/**/*.{coffee,js}', [
    'compile', 'reload'], function(e) {
      console.log(e.path + ' changed.');
  });
  gulp.watch(['test/index.html', 'src/**/*'], ['reload']);
});

gulp.task('compile', function() {
  return gulp.src('./src/**/*.coffee')
      .pipe(coffee({bare: true}).on('error', function(err) {throw err}))
      .pipe(gulp.dest('./lib'));
});

// gulp.task('test', ['compile'], function() {
//   return gulp.src('./test/**/*.js', {read: false})
//     .pipe(mocha({ui: 'tdd', bail: true}));  
// });

gulp.task('test', function() {
  karma.start({
    configFile: path.join(process.cwd(), 'test/karma.conf.js')
  }, process.exit);
});

gulp.task('tdd', function() {
  karma.start({
    configFile: path.join(process.cwd(), 'test/karma.conf.js'),
    singleRun: false,
    browsers: ['Chrome']
  }, process.exit);
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('reload', function() {
  gulp.src('test/*.html')
    .pipe(connect.reload())
});

gulp.task('build', ['test'], function() {
  return gulp.src('lib/groove.js')
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('lib/groove.min.js'));
})

gulp.task('default', ['connect']);