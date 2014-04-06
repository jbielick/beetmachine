(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';
    var MessageModel;
    return MessageModel = (function(_super) {
      __extends(MessageModel, _super);

      function MessageModel() {
        return MessageModel.__super__.constructor.apply(this, arguments);
      }

      return MessageModel;

    })(Backbone.Model);
  });

}).call(this);
