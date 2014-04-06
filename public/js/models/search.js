(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';
    var SearchModel;
    return SearchModel = (function(_super) {
      __extends(SearchModel, _super);

      function SearchModel() {
        return SearchModel.__super__.constructor.apply(this, arguments);
      }

      return SearchModel;

    })(Backbone.Model);
  });

}).call(this);
