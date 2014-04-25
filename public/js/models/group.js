(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'deepmodel', 'collections/sample', 'collections/pattern'], function(_, Backbone, deepmodel, SampleCollection, PatternCollection) {
    var GroupModel;
    return GroupModel = (function(_super) {
      __extends(GroupModel, _super);

      function GroupModel() {
        return GroupModel.__super__.constructor.apply(this, arguments);
      }

      GroupModel.prototype.initialize = function(attrs, options) {
        var _ref;
        if (attrs == null) {
          attrs = {};
        }
        if (options == null) {
          options = {};
        }
        _ref = options.collection, this.app = _ref.app, this.pads = _ref.pads;
        this.samples = new SampleCollection(attrs.samples || [
          {
            pad: 1
          }
        ], {
          group: this
        });
        return this.patterns = new PatternCollection(attrs.patterns || [
          {
            position: 1
          }
        ], {
          group: this
        });
      };

      GroupModel.prototype.url = function() {
        if (this.isNew() && this.get('recipe_id')) {
          return "/recipes/" + (this.get('recipe_id')) + "/groups";
        } else {
          if (this.isNew()) {
            return "/groups";
          } else {
            return "/groups/" + (this.get('id'));
          }
        }
      };

      return GroupModel;

    })(Backbone.DeepModel);
  });

}).call(this);
