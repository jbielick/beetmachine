(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'models/message'], function(_, Backbone, MessageModel) {
    var MessageCollection;
    return MessageCollection = (function(_super) {
      __extends(MessageCollection, _super);

      function MessageCollection() {
        return MessageCollection.__super__.constructor.apply(this, arguments);
      }

      MessageCollection.prototype.model = MessageModel;

      return MessageCollection;

    })(Backbone.Collection);
  });

}).call(this);
