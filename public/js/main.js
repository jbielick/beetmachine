(function() {
  'use strict';
  require.config({
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      foundation: ['jquery'],
      bootstrap: ['jquery'],
      soundcloud: {
        exports: 'SC'
      },
      timbre: {
        exports: 'T'
      }
    },
    paths: {
      jquery: '/bower_components/jquery/jquery',
      backbone: '/bower_components/backbone/backbone',
      deepmodel: '/bower_components/backbone-deep-model/distribution/deep-model',
      underscore: '/bower_components/underscore/underscore',
      text: '/bower_components/requirejs-text/text',
      foundation: 'vendor/foundation.min',
      dropzone: 'vendor/dropzone.min',
      ligaments: 'vendor/ligaments',
      soundcloud: 'http://connect.soundcloud.com/sdk',
      bootstrap: 'vendor/bootstrap.min',
      timbre: 'vendor/timbre.dev',
      socketio: 'vendor/socket.io',
      async: '/bower_components/async/lib/async'
    }
  });

  require(['jquery', 'foundation', 'socketio', 'timbre', 'backbone', 'views/app'], function($, foundation, io, Timbre, Backbone, App) {
    var doc;
    Backbone.history.start();
    $(document).foundation();
    doc = document.documentElement;
    return doc.setAttribute('data-useragent', navigator.userAgent);
  });

}).call(this);
