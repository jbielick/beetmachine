(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'bootstrap', 'underscore', 'backbone', 'models/modal', 'ligaments', 'text!/js/templates/modal.ejs'], function($, _, foundation, Backbone, ModalModel, ModalTemplate) {
    var ModalView;
    return ModalView = (function(_super) {
      __extends(ModalView, _super);

      function ModalView() {
        return ModalView.__super__.constructor.apply(this, arguments);
      }

      ModalView.prototype.template = _.template(ModalTemplate);

      ModalView.prototype.attributes = {
        'class': 'modal fade'
      };

      ModalView.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.model = new ModalModel(options.data);
        this.render();
        return new Backbone.Ligaments({
          model: this.model,
          view: this
        });
      };

      ModalView.prototype.show = function() {
        return this.$el.modal('show');
      };

      ModalView.prototype.close = function() {
        return this.$el.modal('hide');
      };

      ModalView.prototype.render = function() {
        return this.el.innerHTML = this.template(this.model.toJSON());
      };

      return ModalView;

    })(Backbone.View);
  });

}).call(this);
