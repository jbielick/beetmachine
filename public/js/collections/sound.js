(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'models/sound'], function(_, Backbone, SoundModel) {
    var SoundCollection;
    return SoundCollection = (function(_super) {
      __extends(SoundCollection, _super);

      function SoundCollection() {
        return SoundCollection.__super__.constructor.apply(this, arguments);
      }

      SoundCollection.prototype.initialize = function(models, options) {
        if (options == null) {
          options = {};
        }
        return this.group = options.group;
      };

      SoundCollection.prototype.model = SoundModel;

      return SoundCollection;

    })(Backbone.Collection);
  });

}).call(this);
