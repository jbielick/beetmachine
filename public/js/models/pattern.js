(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'deepmodel', 'views/pattern.grid'], function(_, Backbone, deepmodel, PatternGridView) {
    var PatternModel;
    return PatternModel = (function(_super) {
      __extends(PatternModel, _super);

      function PatternModel() {
        return PatternModel.__super__.constructor.apply(this, arguments);
      }

      PatternModel.prototype.defaults = function() {
        var attrs;
        return attrs = {
          triggers: {},
          len: 4,
          position: 1,
          zoom: 2,
          step: 64
        };
      };

      PatternModel.prototype.url = function() {
        if (this.isNew() && this.get('groupId')) {
          return "/groups/" + (this.get('groupId')) + "/patterns";
        } else {
          if (this.isNew()) {
            return "/patterns";
          } else {
            return "/patterns/" + (this.get('id'));
          }
        }
      };

      PatternModel.prototype.initialize = function(attrs, options) {
        if (attrs == null) {
          attrs = {};
        }
        if (options == null) {
          options = {};
        }
        return this.view = new PatternGridView({
          model: this
        });
      };

      PatternModel.prototype.toJSON = function() {
        var attrs;
        attrs = _.deepClone(this.attributes);
        attrs.zoom = parseInt(attrs.zoom, 10) || 2;
        attrs.step = parseInt(attrs.step, 10) || 64;
        return attrs;
      };

      return PatternModel;

    })(Backbone.DeepModel);
  });

}).call(this);
