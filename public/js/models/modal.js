// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';
    var ModalModel, _ref;
    return ModalModel = (function(_super) {
      __extends(ModalModel, _super);

      function ModalModel() {
        _ref = ModalModel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ModalModel.prototype.defaults = {
        cancel: true,
        action: true,
        title: '',
        body: ''
      };

      return ModalModel;

    })(Backbone.Model);
  });

}).call(this);
