(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'models/display', 'ligaments', 'text!/js/templates/display.ejs'], function($, _, Backbone, DisplayModel, ligaments, DisplayTemplate) {
    var DisplayView;
    return DisplayView = (function(_super) {
      __extends(DisplayView, _super);

      function DisplayView() {
        return DisplayView.__super__.constructor.apply(this, arguments);
      }

      DisplayView.prototype.el = '.display';

      DisplayView.prototype.template = _.template(DisplayTemplate);

      DisplayView.prototype.initialize = function(options) {
        this.app = options.app;
        this.model = new DisplayModel();
        this.render();
        this.$canvas = this.$('#waveform');
        return new Backbone.Ligaments({
          model: this.model,
          view: this
        });
      };

      DisplayView.prototype.log = function(options) {
        var message;
        if (typeof options === 'string') {
          message = options;
        } else {
          message = options.message;
        }
        this.model.set('one', message);
        return this.render();
      };

      DisplayView.prototype.render = function() {
        return this.el.innerHTML = this.template(this.model.toJSON());
      };

      return DisplayView;

    })(Backbone.View);
  });

}).call(this);
