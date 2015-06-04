// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-07-02 using
// generator-karma 0.8.2

module.exports = function(config) {
  config.set({

    autoWatch: true,

    basePath: process.cwd(),

    frameworks: ['mocha', 'chai'],

    preprocessors: {
      'lib/**/*.js': ['coverage']
    },

    files: [
      {pattern: 'lib/assets/**/*', included: false, watched: true},
      'lib/**/*.js',
      'test/**/*.spec.js'
    ],

    exclude: [],

    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'Chrome'
    ],

    reporters: ['spec', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'test/coverage'
    },

    singleRun: true,

    colors: true,

    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_WARN,
  });
};
