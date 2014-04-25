(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'views/app', 'views/pads'], function(Backbone, App, Pads) {
    var AppRouter;
    return AppRouter = (function(_super) {
      __extends(AppRouter, _super);

      function AppRouter() {
        return AppRouter.__super__.constructor.apply(this, arguments);
      }

      AppRouter.prototype.routes = {
        '': 'main',
        'pad/:num': 'sampleEditor',
        'beet/:id': 'open'
      };

      AppRouter.prototype.initialize = function(options) {
        return this.app = options.app, options;
      };

      AppRouter.prototype.main = function() {};

      AppRouter.prototype.sampleEditor = function(padNumber) {};

      AppRouter.prototype.open = function(id) {
        return console.log('open ' + id);
      };

      return AppRouter;

    })(Backbone.Router);
  });

}).call(this);
