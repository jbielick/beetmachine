(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'deepmodel', 'views/pattern'], function(_, Backbone, deepmodel, PatternView) {
    var PatternModel;
    return PatternModel = (function(_super) {
      __extends(PatternModel, _super);

      function PatternModel() {
        return PatternModel.__super__.constructor.apply(this, arguments);
      }

      PatternModel.prototype.initialize = function(attrs, options) {
        if (attrs == null) {
          attrs = {};
        }
        if (options == null) {
          options = {};
        }
        this.group = options.group;
        return this.view = new PatternView({
          model: this,
          app: options.app,
          pads: options.pads
        });
      };

      PatternModel.prototype.url = '/patterns';

      return PatternModel;

    })(Backbone.DeepModel);
  });

}).call(this);
