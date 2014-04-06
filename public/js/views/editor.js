(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'bootstrap', 'underscore', 'backbone', 'ligaments', 'views/display', 'text!/js/templates/editor.ejs'], function($, bootstrap, _, Backbone, ligaments, Display, EditorTemplate) {
    var EditorView;
    return EditorView = (function(_super) {
      __extends(EditorView, _super);

      function EditorView() {
        return EditorView.__super__.constructor.apply(this, arguments);
      }

      EditorView.prototype.template = _.template(EditorTemplate);

      EditorView.prototype.attributes = {
        'class': 'modal fade'
      };

      EditorView.prototype.initialize = function(options) {
        this.viewVars = {};
        this.model = options.model, this.pad = options.pad;
        this.render();
        return new Backbone.Ligaments({
          model: this.model,
          view: this
        });
      };

      EditorView.prototype.events = {
        'click [data-behavior]': 'delegateBehavior',
        'click canvas': 'play',
        'change input.eq': 'eq'
      };

      EditorView.prototype.delegateBehavior = function(e) {
        var behavior;
        behavior = $(e.currentTarget).data('behavior');
        if ((behavior != null) && _.isFunction(this[behavior])) {
          return this[behavior].call(this, e);
        }
      };

      EditorView.prototype.eq = function(e) {
        var freq, param;
        param = e.currentTarget.getAttribute('data-param');
        freq = this.model.get('fx.eq.params.' + param);
        freq[2] = parseInt($(e.currentTarget).val(), 10);
        this.model.set('fx.eq.params.' + param, freq);
        return console.log(freq);
      };

      EditorView.prototype.tab = function(e) {
        var tabClass;
        tabClass = $(e.currentTarget).data('tab');
        $(e.currentTarget).addClass('active').siblings().removeClass('active');
        this.$('.tab-pane').hide();
        return this.$('.tab-pane' + tabClass).show();
      };

      EditorView.prototype.toggleEffect = function(e) {
        var effect;
        effect = $(e.currentTarget).data('effect');
        if (!this.model.get("fx." + effect)) {
          this.viewVars.show = effect;
          return this.addEffect(effect);
        } else {
          delete this.viewVars.show;
          return this.removeEffect(effect);
        }
      };

      EditorView.prototype.addEffect = function(effect) {
        var fx;
        switch (effect) {
          case 'reverb':
            fx = {
              room: 0,
              damp: 0,
              mix: 0.5
            };
            break;
          case 'delay':
            fx = {
              time: 100,
              fb: 0.2,
              mix: 0.33
            };
            break;
          case 'chorus':
            fx = {
              type: 'sin',
              delay: 20,
              rate: 4,
              depth: 20,
              fb: 0.2,
              wet: 0.33
            };
        }
        this.model.set("fx." + effect, fx);
        return this.render();
      };

      EditorView.prototype.removeEffect = function(effect) {
        this.model.unset("fx." + effect);
        return this.render();
      };

      EditorView.prototype.play = function(e) {
        e.preventDefault();
        return this.pad.play();
      };

      EditorView.prototype.show = function() {
        return this.$el.modal('show');
      };

      EditorView.prototype.hide = function() {
        return this.$el.modal('hide');
      };

      EditorView.prototype.render = function() {
        this.el.innerHTML = this.template({
          data: this.model.toJSON(),
          view: this.viewVars
        });
        this.$canvas = this.$('.waveform');
        if (this.pad.T) {
          return this.pad.T.raw.plot({
            target: this.$canvas.get(0),
            background: 'rgb(70,70,70)',
            foreground: '#f08a24'
          });
        }
      };

      return EditorView;

    })(Backbone.View);
  });

}).call(this);
