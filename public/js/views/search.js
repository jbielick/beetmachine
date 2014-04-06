(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone, JST) {
    var SearchView;
    return SearchView = (function(_super) {
      __extends(SearchView, _super);

      function SearchView() {
        return SearchView.__super__.constructor.apply(this, arguments);
      }

      return SearchView;

    })(Backbone.View);
  });

}).call(this);
