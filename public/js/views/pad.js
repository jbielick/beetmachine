(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'backbone', 'models/sound', 'views/editor', 'ligaments', 'text!/js/templates/pad.ejs'], function($, _, Backbone, SoundModel, SoundEditor, ligaments, PadTemplate) {
    var PadView;
    return PadView = (function(_super) {
      __extends(PadView, _super);

      function PadView() {
        return PadView.__super__.constructor.apply(this, arguments);
      }

      PadView.prototype.attributes = {
        "class": 'small-3 columns pad-container'
      };

      PadView.prototype.template = _.template(PadTemplate);

      PadView.prototype.initialize = function(options) {
        this.parent = options.parent;
        this.name = options.name;
        this.number = options.number;
        _.bindAll(this, 'listenToModelEvents', 'press');
        this.on('press', this.press);
        return this.render();
      };

      PadView.prototype.listenToModelEvents = function() {
        this.stopListening(this.model, 'press');
        this.listenTo(this.model, 'press', this.press);
        this.stopListening(this.model, 'loaded');
        return this.listenTo(this.model, 'loaded', (function(_this) {
          return function() {
            _this.$('.pad').addClass('mapped');
            return _this.parent.app.display.log(_this.name + ' loaded');
          };
        })(this));
      };

      PadView.prototype.bootstrapWithModel = function(soundModel) {
        var keyCode;
        if (!soundModel && !soundModel instanceof SoundModel) {
          throw new Error('Must provide a SoundModel instance when mapping a pad.');
        }
        (this.model = soundModel).pad = this;
        this.listenToModelEvents();
        if ((keyCode = this.model.get('keyCode'))) {
          this.model.set('key', String.fromCharCode(keyCode));
        }
        return new Backbone.Ligaments({
          model: this.model,
          view: this
        });
      };

      PadView.prototype.render = function() {
        return this.el.innerHTML = this.template({
          name: this.name
        });
      };

      PadView.prototype.events = {
        'contextmenu .pad': 'edit',
        'mousedown .pad': 'press',
        'mouseup .pad': 'release',
        'dragover': 'prevent',
        'dragenter': 'prevent',
        'drop': 'uploadSample'
      };

      PadView.prototype.prevent = function(e) {
        e.preventDefault();
        return e.stopPropagation();
      };

      PadView.prototype.press = function(e) {
        var _ref;
        if (e == null) {
          e = {};
        }
        if (e && e.button === 2) {
          return true;
        }
        this.$('.pad').addClass('active');
        setTimeout((function(_this) {
          return function() {
            return _this.$('.pad').removeClass('active');
          };
        })(this), 50);
        if ((_ref = this.model) != null ? _ref.loaded : void 0) {
          if (!e.silent) {
            this.parent.trigger('press', this);
          }
          return this.model.play();
        }
      };

      PadView.prototype.release = function(e) {};


      /*
      		  * creates a new model
      		  * Adds itself to the current group's SoundCollection
       */

      PadView.prototype.createModel = function(attrs) {
        if (attrs == null) {
          attrs = {};
        }
        this.model = new SoundModel(_.extend({
          pad: this.$el.index() + 1
        }, attrs));
        this.parent.currentGroup.sounds.add(this.model);
        this.listenToModelEvents();
        return this.model;
      };

      PadView.prototype.uploadSample = function(e) {
        var objectUrl;
        e = e.originalEvent;
        e.preventDefault();
        e.stopPropagation();
        if (!this.model) {
          this.createModel();
        }
        objectUrl = window.URL.createObjectURL(e.dataTransfer.files[0]);
        this.model.set('src', objectUrl);
        return this.parent.app.display.log('File: ' + e.dataTransfer.files[0].name + ' uploaded on pad ' + this.name);
      };

      PadView.prototype.edit = function(e) {
        var editor;
        e.preventDefault();
        if (!this.editor) {
          editor = new SoundEditor({
            model: this.model || this.createModel(),
            pad: this
          });
          return this.editor = editor;
        } else {
          return this.editor.show();
        }
      };

      return PadView;

    })(Backbone.View);
  });

}).call(this);
