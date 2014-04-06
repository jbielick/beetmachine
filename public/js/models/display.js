(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';
    var DisplayModel;
    return DisplayModel = (function(_super) {
      __extends(DisplayModel, _super);

      function DisplayModel() {
        return DisplayModel.__super__.constructor.apply(this, arguments);
      }

      DisplayModel.prototype.defaults = {
        one: 'Welcome',
        time: 0
      };

      DisplayModel.prototype.initialize = function(options) {};

      return DisplayModel;

    })(Backbone.Model);
  });

}).call(this);
