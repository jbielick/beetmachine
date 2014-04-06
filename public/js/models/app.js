(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';
    var AppUiModel;
    return AppUiModel = (function(_super) {
      __extends(AppUiModel, _super);

      function AppUiModel() {
        return AppUiModel.__super__.constructor.apply(this, arguments);
      }

      return AppUiModel;

    })(Backbone.Model);
  });

}).call(this);
