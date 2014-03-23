(function() {
  'use strict';
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var TransportModel;
    return TransportModel = (function(_super) {
      __extends(TransportModel, _super);

      function TransportModel() {
        return TransportModel.__super__.constructor.apply(this, arguments);
      }

      TransportModel.prototype.initialize = function(attrs) {
        if (attrs == null) {
          attrs = {};
        }
        if ((attrs.bpm != null) && attrs.step) {
          return this.set('interval', this.calculateInterval(attrs.bpm, attrs.step));
        }
      };

      TransportModel.prototype.calculateInterval = function(bpm, step) {
        return (60 * 1000) / parseInt(this.get('bpm'), 10) / parseInt(this.get('step'), 10);
      };

      return TransportModel;

    })(Backbone.Model);
  });

}).call(this);
